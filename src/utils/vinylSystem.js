export const VINYL_COLORS = [

    { level: 0, color: 'black'},
    { level: 1, color: 'purple'},
    { level: 2, color: 'blue'},
    { level: 3, color: 'red'},
    { level: 4, color: 'gold'},
];

export function getUnlockedVinyls(level) {
    return VINYL_COLORS.filter(vinyl => vinyl.level <= level);
}