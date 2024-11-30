'use strict'
import _ from'lodash'
import { Types } from 'mongoose'
import { validate,ValidationError } from 'class-validator';
import { BadRequestError } from '../../core/error.response';

export const convertToObjectIdMongodb = (id: string): Types.ObjectId => new Types.ObjectId(id)

export const getInfoData = (field: string[],object: object)=>{
    return _.pick(object,field)
}

//['a','b'] => {a:1,b:1}
export const getSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,1]))
}

//['a','b'] => {a:0,b:0}
export const unGetSelectData = (select: string[])=>{
    return Object.fromEntries(select.map(element => [element,0]))
}

// Modified validator function to handle validation and log errors

function collectValidationKeys(error: ValidationError): string[] {
    let keys: string[] = [];

    // Add the current property's key if it exists
    if (error.property) {
        keys.push(error.property);
    }

    // Check if the error has children
    if (error.children && error.children.length > 0) {
        for (const child of error.children) {
            // Recursively collect keys from children
            keys = keys.concat(collectValidationKeys(child));
        }
    }

    return keys;
}
export async function validator(input: {}): Promise<void> {
    const errors = await validate(input);

    if (errors.length > 0) {
        // Collect all constraint keys from the validation errors
        const allKeys: string[] = errors.flatMap(error => collectValidationKeys(error));
        const uniqueKeys = Array.from(new Set(allKeys)); // Remove duplicates

        // Construct error message
        const errorMessage = `Validation errors on properties: ${uniqueKeys.join(', ')}`;
        console.log(`Validation error: ${errorMessage}`);
        throw new BadRequestError(errorMessage); // Throw an error with all constraint keys
    }
}