const {
  pipe,
  equals,
  count,
  values,
  length,
  where,
  lte,
  converge,
  anyPass,
  allPass,
  prop,
  not,
} = require('ramda');

const { SHAPES, COLORS } = require('../constants');
const { CIRCLE, SQUARE, TRIANGLE, STAR } = SHAPES;
const { RED, BLUE, ORANGE, GREEN, WHITE } = COLORS;

const isRed = equals(RED);
const isBlue = equals(BLUE);
const isOrange = equals(ORANGE);
const isGreen = equals(GREEN);
const isWhite = equals(WHITE);

const getObjLength = pipe(values, length);

const getCountByFilter = (filter) => {
  return pipe(values, count(filter));
};

const getCountOfRed = getCountByFilter(isRed);
const getCountOfBlue = getCountByFilter(isBlue);
const getCountOfOrange = getCountByFilter(isOrange);
const getCountOfGreen = getCountByFilter(isGreen);
// const getCountOfWhite = getCountByFilter(isWhite);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = where({
  [CIRCLE]: isWhite,
  [SQUARE]: isGreen,
  [TRIANGLE]: isWhite,
  [STAR]: isRed,
});

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(values, getCountOfGreen, lte(2));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [
  getCountOfRed,
  getCountOfBlue,
]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = where({
  [CIRCLE]: isBlue,
  [STAR]: isRed,
  [SQUARE]: isOrange,
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  pipe(getCountOfRed, lte(3)),
  pipe(getCountOfBlue, lte(3)),
  pipe(getCountOfOrange, lte(3)),
  pipe(getCountOfGreen, lte(3)),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  pipe(getCountOfGreen, equals(2)),
  where({ [TRIANGLE]: isGreen }),
  pipe(getCountOfRed, equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = converge(equals, [
  getCountOfOrange,
  getObjLength,
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = pipe(
  where({
    [STAR]: anyPass([isRed, isWhite])
  }),
  not
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = converge(equals, [
  getCountOfGreen,
  getObjLength,
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  converge(equals, [prop(TRIANGLE), prop(SQUARE)]),
  pipe(prop(TRIANGLE), isWhite, not),
]);
