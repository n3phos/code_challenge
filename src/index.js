import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { connect } from "react-redux";

import store from "./store";
import { moveTrains, assignTrainToRailway, updatePassengers } from "./actions";

window.store = store;
window.moveTrains = moveTrains;

const title = 'Coding challenge';


const mapStateToProps = state => {
    return state;
};

const mapDispatchToProps = dispatch => {
    return {
        assignTrainToRailway: (train) => dispatch(assignTrainToRailway(train)),
        updatePassengers: (trains) => dispatch(updatePassengers(trains)),
        moveTrains: (trains) => dispatch(moveTrains(trains))
    };
};


class App extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {
        return (
            <ConnectedTrainControl/>
        )
    }
}

class TrainControl extends React.Component {

    constructor(props) {

        super(props);

        this.handleTrains = this.handleTrains.bind(this);
        this.handlePassengers = this.handlePassengers.bind(this);

        Object.filter = (obj, predicate) =>
            Object.keys(obj)
                .filter( key => predicate(obj[key]) )
                .reduce( (res, key) => (res[key] = obj[key], res), {} );

    }

    componentDidMount() {
        let trains = this.props.trains;

        for(let key in trains) {
            this.props.assignTrainToRailway(trains[key]);
        }
    }

    render() {

        return(
            <div>
                <div>
                    <Junctions
                        junctions = {this.props.junctions}
                    />
                </div>
                <div className="railway-container">
                    {this.renderRailways()}
                </div>
                <div>
                    <button key='b1' className="btn" onClick={this.handleTrains}> Move trains </button>
                    <button key='b2' className="btn" onClick={this.handlePassengers}> Add/Remove passengers </button>
                </div>
            </div>
        )
    }

    renderRailways() {
        let railwayComponents = [];
        for(let railway in this.props.railways) {
            railwayComponents.push(
                <Railway
                    railwayLength={this.props.railways[railway]}
                    railwayId={railway}
                    key={railway}
                    train={this.props.trains[railway]}
                />
            )
        }
        return railwayComponents;
    }

    handleTrains() {

        let junctions = this.props.junctions;
        let trains = this.props.trains;
        let mapTrainToNextStation = {};

        // reset the trains
        for(let key in trains) {
            trains[key].canMove = true;
            mapTrainToNextStation[trains[key].id] = this.trainWouldArriveAtStation(trains[key]);
        }

        let trainIsWaiting = false;

        for(let i = 0; i < junctions.length; i++) {
            let junction = junctions[i];

            const trainIds = junction[0];
            const junctionTrainOne = junction[1][0];
            const junctionTrainTwo = junction[1][1];
            const trainOneId = trainIds[0];
            const trainTwoId = trainIds[1];

            let trainOne = trains[trainOneId];
            let trainTwo = trains[trainTwoId];

            const trainOneNextStation = mapTrainToNextStation[trainOneId];
            const trainTwoNextStation = mapTrainToNextStation[trainTwoId];

            if(trainOneNextStation === junctionTrainOne && trainTwoNextStation === junctionTrainTwo) {
                if(trainOne.passengers < trainTwo.passengers) {
                    this.wait(trainOne, trainTwo);
                    trainIsWaiting = true;
                } else if(trainOne.passengers > trainTwo.passengers) {
                    this.wait(trainTwo, trainOne);
                    trainIsWaiting = true;
                }
            }
        }

        if(trainIsWaiting) {
            for(let i = 0; i < junctions.length; i++) {
                let junction = junctions[i];

                const trainIds = junction[0];
                const junctionTrainOne = junction[1][0];
                const junctionTrainTwo = junction[1][1];
                const trainOneId = trainIds[0];
                const trainTwoId = trainIds[1];

                let trainOne = trains[trainOneId];
                let trainTwo = trains[trainTwoId];

                const trainOneNextStation = mapTrainToNextStation[trainOneId];
                const trainTwoNextStation = mapTrainToNextStation[trainTwoId];

                if (trainTwoNextStation === junctionTrainTwo && !trainOne.canMove && trainOne.station === junctionTrainOne) {
                    this.wait(trainTwo, trainOne);
                }

                if (trainOneNextStation === junctionTrainOne && !trainTwo.canMove && trainTwo.station == junctionTrainTwo) {
                    this.wait(trainOne, trainTwo);
                }
            }
        }

        for(let key in trains) {
            if(trains[key].canMove) {
                this.move(trains[key]);
            }
        }

        console.log("_________________________________________");

        this.props.moveTrains(trains);
    }

    handlePassengers() {
        let trains = this.props.trains;
        const randomPassengersForTrain = this.randomPassengers();

        for(let key in trains) {
            trains[key].passengers = randomPassengersForTrain[key-1];
        }

        this.props.updatePassengers(trains);
    }

    wait(train, train2) {
        train.canMove = false;
        console.log("train " + train.id + " with " + train.passengers + " passengers is waiting for train " + train2.id);
    }

    move(train) {
        if(train.reverseDirection) {
            train.station--;

            if(train.station === 0) {
                this.changeTrainDirection(train);
            }
        } else {
            train.station++;

            if(train.station === train.terminusStation) {
                this.changeTrainDirection(train);
            }
        }

        console.log("train " + train.id + " with " + train.passengers + " passengers is moving");
        return train;
    }

    trainWouldArriveAtStation(train) {
        if(train.reverseDirection) {
            return train.station - 1;
        } else {
            return train.station + 1;
        }
    }

    changeTrainDirection(train) {
        train.reverseDirection = !train.reverseDirection;
    }

    /* generates 3 unique random numbers between 0 - 50 */

    randomPassengers() {
        let arr = [];
        while(arr.length < 3){
            const randomNumber = Math.floor(Math.random()*50) + 1;
            if(arr.indexOf(randomNumber) > -1) continue;
            arr[arr.length] = randomNumber;
        }
        return arr;
    }
}

const ConnectedTrainControl = connect(mapStateToProps, mapDispatchToProps)(TrainControl);

const Junctions = (props) => {
    const renderJunctions = (junctions) => {
        let junctionComponents = [];

        for(let i = 0; i < junctions.length; i++) {
            const junction = junctions[i];
            const trainIds = junction[0];
            const junctionTrainOne = junction[1][0];
            const junctionTrainTwo = junction[1][1];

            junctionComponents.push(
                <p key={i}>
                    junctions on railways {trainIds[0]} and {trainIds[1]} : {junctionTrainOne} & {junctionTrainTwo}
                </p>
            );
        }

        return junctionComponents
    };

    return (
        <div>
            {renderJunctions(props.junctions)}
        </div>
    )
};

const Station = (props) => {
    return (
        <li className="station" >
            <span className="station-circle"></span>
            <div>{props.index}</div>
        </li>
    );
};

const Train = (props) => {
    return (
        <li className="station" >
            <div>
                <span className="train" style={{backgroundColor: props.color}}>{props.passengers}</span>
            </div>
            <div>{props.index}</div>
        </li>
    )
};

const Railway = (props) => {

    const renderRailwayAndTrain = (railwayLength, id, train) => {
        let railwayComponents = [];
        const direction = train.reverseDirection ?  "left" : "right";
        const cssClass = "fa fa-long-arrow-" + direction;

        railwayComponents.push(
            <li key={id + railwayLength} className="station" >
                <span className={cssClass} style={{fontSize: '18px'}}></span>
            </li>
        );

        for(let i = 0; i < railwayLength; i++) {
            if(i === train.station) {
                railwayComponents.push(
                    <Train
                        passengers={train.passengers}
                        color={train.color}
                        key={id + i}
                        index={i}
                    />
                );
            } else {
                railwayComponents.push(
                    <Station
                        key={id + i}
                        index={i}
                    />);
            }
        }

        return railwayComponents;
    };

    return (
        <div className="railway">
            <span>railway {props.railwayId} </span>
            <ul>
                {renderRailwayAndTrain(props.railwayLength, props.railwayId, props.train)}
            </ul>
        </div>
    )
};


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);

//module.hot.accept();
