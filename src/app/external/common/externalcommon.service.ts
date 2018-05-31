import { Injectable } from '@angular/core';
import {CommonService} from "../../common/common.service";

@Injectable()
export class ExternalcommonService {

  constructor(private commonService: CommonService) {
  }


  getUserTokenInfo(userId: string, token: string) {
    return this.commonService.doGet('/commonapi/v2/users/' + userId + '/search/refreshtoken?refreshToken=' + token, '');
  }


  reset(param) {
    return this.commonService.doPost('/portalapi/v2/users/password/reset', param, '');
  }

  updateInfo(userId: string, param) {
    return this.commonService
      .doPut('/commonapi/v2/user/' + userId, param, '').map((res: Response) => {
        return res['result'];
      }).subscribe();
  }

  createUser(param) {
    return this.commonService.doPost('/portalapi/v2/users', param, '');
  }
}
