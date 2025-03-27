import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class DateValidators {

    static minDate(): ValidatorFn {
        return (control:AbstractControl) : ValidationErrors | null => {
            
            const inputDate = control.value;

            if (!inputDate)
                return null;

            const minimumDate = new Date();
            minimumDate.setHours(0,0,0,0);

            const isHigherThanOrEqualMin = inputDate >= minimumDate;

            return !isHigherThanOrEqualMin ? {minDate:true}: null;
        }
    }

    static maxDate(): ValidatorFn {
        return (control:AbstractControl) : ValidationErrors | null => {
            
            const inputDate = control.value;

            if (!inputDate)
                return null;

            const maximumDate = new Date();
            maximumDate.setDate(maximumDate.getDate() + 7)
            maximumDate.setHours(0,0,0,0);

            const isLowerThanOrEqualMax = inputDate <= maximumDate;

            return !isLowerThanOrEqualMax ? {maxDate:true}: null;
        }
    }
}