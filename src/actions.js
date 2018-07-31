import { ASSIGN_TRAIN, UPDATE_TRAINS } from './action-types';

export const moveTrains = trains => ({ type: UPDATE_TRAINS, payload: trains });

export const assignTrainToRailway = train => ({ type: ASSIGN_TRAIN, payload: train});

export const updatePassengers = trains => ({ type: UPDATE_TRAINS, payload: trains});
