
import React from 'react';
import { mount } from './enzyme';
import { createRoot } from '../src/root';


var assert = require('assert');

describe('<App />', function() {

    const Root = createRoot();
    const wrapper = mount(<Root />);
    const trainControlComponent = wrapper.find('MyTrainControl');
    const junctions = trainControlComponent.props().junctions;

    const checkCollisions = () => {
        let collision = false;
        const trains = trainControlComponent.props().trains;

        junctions.forEach((junction) => {

            const trainIds = junction[0];
            const junctionTrainOne = junction[1][0];
            const junctionTrainTwo = junction[1][1];
            const trainOneId = trainIds[0];
            const trainTwoId = trainIds[1];

            let trainOne = trains[trainOneId];
            let trainTwo = trains[trainTwoId];

            if(trainOne.station === junctionTrainOne && trainTwo.station === junctionTrainTwo) {
                collision = true;
            }
        });

        return collision;
    };

    describe('<TrainControl />', function() {
        describe('#handleTrains', function() {
            it('should not produce any train collisions', function () {

                for(let i = 0; i <= 300; i++) {
                    trainControlComponent.instance().handleTrains();
                    trainControlComponent.instance().handlePassengers();

                    console.log("handleTrains: " + i);
                    expect(checkCollisions()).toBe(false);
                }
            });
        })
    });

});
