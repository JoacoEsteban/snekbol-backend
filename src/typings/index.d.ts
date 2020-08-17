declare type Nullable<T> = T | null;

declare type coord = [
  number, number
]

declare enum AllowedDirections {
  up = 0,
  right = 1,
  down = 2,
  left = 3,
}

declare enum AllowedDirectives {
  CONNECT,
  IM_READY,
  DIRECTION,
}

declare interface WsMessage {
  player_id: string,
  player_secret: string,
  directive: AllowedDirectives,
  game_id?: string,
  direction?: AllowedDirections

}