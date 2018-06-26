import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {OrgService} from "../../org/common/org.service";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-invite-org',
  templateUrl: './invite-org.component.html',
  styleUrls: ['./invite-org.component.css']
})
export class InviteOrgComponent implements OnInit, AfterViewChecked {
  private waitTime: number = 5 * 1000;
  private timestamp: number;

  private _userId: string;
  private _orgName: string;
  private refreshToken: string;

  constructor(private common: CommonService, private orgService: OrgService,
              private router: Router, private logger: NGXLogger) {

  }

  ngOnInit() {
    // last
    if (this.common.isLoading === false) {
      this.common.isLoading = true;
    }

    //const params = location.search.split(/[?&]/);
    const parser = new URLSearchParams(location.search.replace(/[?]/, ''));
    this.userId = parser.get('userId');
    this.orgName = parser.get('orgName');
    this.refreshToken = parser.get('refreshToken');

    // remove parameters
    //location.hash = '';
    //location.search = '';
    this.userInviteAccept();

    // window.setTimeout(() => {
    //   this.common.isLoading = false;
    //
    //   this.timestamp = new Date().getTime();
    //   this.logger.debug('first false action!');
    // }, 10000);
  }

  userInviteAccept() {
    let params = {
      token: this.refreshToken
    };

    this.orgService.userInviteAccept(params).subscribe(data => {
      console.log(data);

      //TODO 실패처리

      if(data != null) {
        $("[id^='layerpop']").modal("hide");
        this.common.isLoading = false;
      }

      setTimeout(() => {
        const current = new Date().getTime();
        this.logger.debug('auto-navigate organization... ');
        this.logger.debug('userId : ', this.userId, ' / orgName : ', this.orgName, ' / refreshToken : ', this.refreshToken);
        this.logger.debug('start : ', this.timestamp, 'want to wait time : ', this.waitTime, 'real wait time : ', (current - this.timestamp), 'ms');
        this.router.navigate(['/']);
      }, this.waitTime);
    });
  }

  ngAfterViewChecked() {
    /*

    */
    this.logger.debug('checked test');
    /*
    if (this.common.isLoading === false) {

    }
    */
    if (this.common.isLoading === false) {
      setTimeout(() => {
        const current = new Date().getTime();
        this.logger.debug('auto-navigate organization... ');
        this.logger.debug('userId : ', this.userId, ' / orgName : ', this.orgName, ' / refreshToken : ', this.refreshToken);
        this.logger.debug('start : ', this.timestamp, 'want to wait time : ', this.waitTime, 'real wait time : ', (current - this.timestamp), 'ms');
        this.router.navigate(['/']);
      }, this.waitTime);
    }
  }

  get userId() { return this._userId; }
  set userId(param) { this._userId = param; }

  get orgName() { return this._orgName; }
  set orgName(param) { this._orgName = param; }
}
