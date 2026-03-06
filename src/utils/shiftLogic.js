import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export const SHIFT_SEQUENCE = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Off', 'Spare'];

/**
 * Calculates the shift for a given target date based on a reference date and reference shift.
 * 
 * @param {Date|string} targetDate - The date to calculate the shift for
 * @param {Date|string} refDate - The reference start date
 * @param {string} refShift - The shift that occurred on the reference date
 * @returns {string} The calculated shift (e.g., 'A1', 'Off')
 */
export const calculateShift = (targetDate, refDate, refShift) => {
    const target = startOfDay(typeof targetDate === 'string' ? parseISO(targetDate) : targetDate);
    const ref = startOfDay(typeof refDate === 'string' ? parseISO(refDate) : refDate);

    const daysDiff = differenceInDays(target, ref);

    const refIndex = SHIFT_SEQUENCE.indexOf(refShift);
    if (refIndex === -1) return 'Unknown';

    // Modulo in JS can be negative, so we handle negative days difference properly
    const totalShifts = SHIFT_SEQUENCE.length;
    let newIndex = (refIndex + (daysDiff % totalShifts)) % totalShifts;

    if (newIndex < 0) {
        newIndex += totalShifts;
    }

    return SHIFT_SEQUENCE[newIndex];
};
