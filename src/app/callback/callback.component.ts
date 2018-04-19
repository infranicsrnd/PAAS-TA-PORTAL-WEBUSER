import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {authConfig, UaaSecurityService} from '../auth/uaa-security.service';
import {Log} from 'ng2-logger/client';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="col-md-6 col-md-offset-3">
      <div>loading....</div>      
    </div>
  `,
  styles: []
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private uaa: UaaSecurityService, private log: NGXLogger) {
    route.queryParams.subscribe(params => {
      if (params != null) {
        if (params['error'] != null) {
          this.log.debug('Error');
          this.router.navigate(['/login']);
        } else {
          if (this.commonService.getToken() == null) {
            this.log.debug('Non Error');
            authConfig.code = params.code;
            this.uaa.doToken();
          }
        }
      } else {
        this.uaa.doAuthorization();
      }
    });
  }

  ngOnInit() {
  }

}