import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";

@Injectable()
export class CatalogService {
  COMMONAPI : string = '/commonapi';
  V2_URL : string = '/v2';
  DEVELOPGET : string = this.COMMONAPI + this.V2_URL +'/developpacks';
  TEMPLATEGET : string = this.COMMONAPI + this.V2_URL + '/starterpacks';
  SEARCHGET : string = this.COMMONAPI + this.V2_URL + '/packs';
  HISTORYGET : string = this.COMMONAPI + this.V2_URL + '/history/';
  STARTERGET : string = this.COMMONAPI + this.V2_URL + '/packrelation/';


  userid : string;
  developments : Array<Development> = Array<Development>();
  templates : Array<Template> = Array<Template>();
  recentpacks : Array<Development|Template> = Array<Development|Template>();
  constructor(private common: CommonService, private log: NGXLogger) {
    this.userid = "pch1234";
  }

  developInit()
  {
    this.common.doGET(this.DEVELOPGET, null).subscribe(data => {
      this.DevelopmentInit(data['list']);
    });
    this.common.doGET(this.TEMPLATEGET, null).subscribe(data =>{
        this.TemplateInit(data['list']);
    })
    this.common.doGET(this.HISTORYGET+this.userid+'?searchKeyword=', null).subscribe(data =>{
     let lenght = data['list'].length;
      for(let i =0; i < lenght; i++) {
        let dev = data['list'][i];
        this.recentpacks[i] = dev;
        console.log(this.recentpacks[i]);
      }

    })
  }

  Search(searchKeyword : string)
  {
    this.common.doGET(this.SEARCHGET+'?searchKeyword='+searchKeyword, null).subscribe(data => {this.DevelopmentInit(data['BuildPackList']); this.TemplateInit(data['TemplateList']);});
    this.recentpacks = new Array<Development|Template>();
    this.common.doGET(this.HISTORYGET+this.userid+'?searchKeyword='+searchKeyword, null).subscribe(data =>{
      let lenght = data['list'].length;
      for(let i =0; i < lenght; i++) {
        let dev = data['list'][i];
        this.recentpacks[i] = dev;
        console.log(this.recentpacks[i]);
      }})
  }

  DevelopmentInit(data : any)
  {
    this.developments = new Array<Development>();
    for(let i = 0 ; i < data.length ; i++) {
      this.developments[i] = data[i];
    }
  }

  TemplateInit(data : any)
  {
    this.templates = new Array<Template>();
    for(let i = 0 ; i < data.length ; i++) {
      this.templates[i] = data[i];
    }
  }

  CatalogDetailInit(no : number){
    return this.common.doGET(this.STARTERGET+no ,null).map((res: Response) => {
      return res;
    }).do(console.log);
  }

}

export class Development
{
  appSampleFileName : string;
  appSampleFilePaht : string;
  appSampleFilePath : string;
  appSampleFileSize : string;
  buildPackName : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  summary : string;
  thumbImgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;
}

export class Template
{
  buildPackCategoryNo : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  servicePackCategoryNoList : string;
  summary : string;
  thumbIimgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;
}

export class Service
{
  appBindParameter : string;
  appBindYn : string;
  app_bind_parameter : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  dashboardUseYn : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  parameter : string;
  servicePackName : string;
  summary : string;
  thumbIimgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;

}
