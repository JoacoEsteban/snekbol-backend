export type Nullable<T> = T | null

export type coord = [
  number, number
]

export enum AllowedDirections {
  up = 0,
  right = 1,
  down = 2,
  left = 3,
}

export enum AllowedDirectives {
  CONNECT = 'connect',
  IM_READY = 'imready',
  DIRECTION = 'direction',
}

export interface WsMessage {
  player_id: string,
  player_secret: string,
  directive: AllowedDirectives,
  game_id?: string,
  direction?: AllowedDirections

}