export class ResponseUserListDto {
  name: string;
  signUpDate: Date;
  session: SessionDto;
}

export class SessionDto {
  loginCount: number;
  latestLogoutDate: Date;
  currentActiveSessionCount: number;
}
