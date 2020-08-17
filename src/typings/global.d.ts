declare module NodeJS  {
  interface Global {
    _: _.LoDashStatic;
    uuid: () => string
  }
}