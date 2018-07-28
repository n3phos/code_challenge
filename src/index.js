import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Coding challenge';

class TrainControl extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            junctions: [
                [[1,2],[2,2]], // between railway 1 and 2, junction at 2
                [[1,3],[3,4]], // between railway 1 and 3, junction at 3,4
                [[2,3],[3,2]], // between railway 2 and 3, junction at 3,2
            ],
            railways: {
                1: 6, // number of stations
                2: 5,
                3: 8
            },
            trains: [
                {
                    id: 1,
                    passengers: 10,
                    terminusStation: 0,
                    station: 0,
                    reverseDirection: false,
                    canMove: true,
                    color: 'deepskyblue'
                },
                {
                    id: 2,
                    passengers: 20,
                    terminusStation: 0,
                    station: 0,
                    reverseDirection: false,
                    canMove: true,
                    color: 'green'
                 },
                {
                    id: 3,
                    passengers: 30,
                    terminusStation: 0,
                    station: 0,
                    reverseDirection: false,
                    canMove: true,
                    color: 'cyan'
                }
            ]
        };

        this.handleTrains = this.handleTrains.bind(this);
        this.handlePassengers = this.handlePassengers.bind(this);

        let trains = this.state.trains;

        trains.forEach(train => {
            this.assignTrainToRailway(train, train.id);
        });
    }

    assignTrainToRailway(train) {
        let railwayLength = this.state.railways[train.id];
        train.terminusStation = railwayLength -1;
    }

    render() {
        return(
            <div>
                <div>
                    <Junctions
                        junctions = {this.state.junctions}
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
        for(let railway in this.state.railways) {
            railwayComponents.push(
                <Railway
                    railwayLength={this.state.railways[railway]}
                    railwayId={railway}
                    key={railway}
                    train={this.state.trains[railway-1]}
                />
            )
        }
        return railwayComponents;
    }

    handleTrains() {
        // make a copy of state
        let state = JSON.parse(JSON.stringify(this.state));

        let junctions = this.state.junctions;

        let trains = state.trains;
        let mapTrainToNextStation = {};

        // reset the trains
        trains.map(train => train.canMove = true);

        trains.forEach(train => {
            mapTrainToNextStation[train.id] = this.trainWouldArriveAtStation(train);
        });

        let trainIsWaiting = false;

        for(let i = 0; i < junctions.length; i++) {
            let junction = junctions[i];

            const trainIds = junction[0];
            const junctionTrainOne = junction[1][0];
            const junctionTrainTwo = junction[1][1];
            const trainOneId = trainIds[0];
            const trainTwoId = trainIds[1];

            let trainOne = trains[trainOneId-1];
            let trainTwo = trains[trainTwoId-1];

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

                let trainOne = trains[trainOneId - 1];
                let trainTwo = trains[trainTwoId - 1];

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

        trains.filter(train => train.canMove).forEach(train => this.move(train));
        console.log("_________________________________________");

        this.setState({trains: trains});
    }

    handlePassengers() {
        let trains = JSON.parse(JSON.stringify(this.state.trains));
        const randomPassengersForTrain = this.randomPassengers();

        trains.map((train, index) => {
            train.passengers = randomPassengersForTrain[index];
        });

        this.setState({trains: trains});
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
   <TrainControl/>,
    document.getElementById('app')
);

//module.hot.accept();
