import { ASSIGN_TRAIN, UPDATE_TRAINS} from "./action-types";

const initialState = {

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
    trains: {
        1: {
            id: 1,
            passengers: 10,
            terminusStation: 0,
            station: 0,
            reverseDirection: false,
            canMove: true,
            color: 'deepskyblue'
        },
        2: {
            id: 2,
            passengers: 20,
            terminusStation: 0,
            station: 0,
            reverseDirection: false,
            canMove: true,
            color: 'green'
        },
        3: {
            id: 3,
            passengers: 30,
            terminusStation: 0,
            station: 0,
            reverseDirection: false,
            canMove: true,
            color: 'cyan'
        }
    }
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        case ASSIGN_TRAIN:
            let train = action.payload;
            const railwayLength = state.railways[train.id];

            return  {
                ...state,
                trains: {
                    ...state.trains,
                    [train.id]: {
                        ...state.trains[train.id],
                        terminusStation: railwayLength - 1
                    }
                },
            };

        case UPDATE_TRAINS:

            let newState = {
                ...state,
                trains: {
                    ...action.payload
                }
            };

            return newState;

        default:
            return state;
    }
};

export default rootReducer;
