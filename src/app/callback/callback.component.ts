import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SecurityService} from '../auth/security.service';
import {Log} from 'ng2-logger/client';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';
import {AppConfig} from "../app.config"

@Component({
  selector: 'app-callback',
  template: `
  `,
  styles: []
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private sec: SecurityService, private log: NGXLogger) {
    this.log.debug('callback');
    this.commonService.isLoading = true;
    console.log("token :: " + this.commonService.getToken());
    if (this.commonService.getToken() != null) {
      this.sec.doUserInfo();
    } else {
      route.queryParams.subscribe(params => {
        this.commonService.isLoading = false;
        if (params != null) {
          if(params['code'] == 'undefined' || params['code'] == null){
            this.router.navigate(['/login']);
          }
          if (params['error'] != null) {
            this.router.navigate(['/login']);
          } else {
            AppConfig.code = params.code;
            this.sec.doToken();
          }
        } else {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  ngOnInit() {
  }

}
