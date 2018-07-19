import {Component, OnInit} from '@angular/core';
import {CatalogService} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {


  searchKeyword : string='';
  userid : string;
  recentpacks : Array<any> = Array<any>();
  translateEntities : any;
  constructor(private translate: TranslateService, private catalogService: CatalogService, private logger: NGXLogger,private router: Router) {
    this.userid = catalogService.getUserid();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
    });
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
    });
  }


  ngOnInit() {
    var name = this.catalogService.classname;
    var check = this.catalogService.check;
    console.log(check);
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
          $('#nav_first').attr('class','');
          $('#nav_second').attr('class','');
          $('#nav_third ').attr('class','');
          $('#nav_fourth').attr('class','');
          if(check){
            $('#nav_first').attr('class','cur');
          }
          else{
            $(name).attr('class','cur');
          }
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });
    if(check){
    this.catalogService.viewPacks(true, true, true);
    }
      this.catalogService.getStarterPacks(CATALOGURLConstant.GETSTARTERPACKS).subscribe(data => {
      this.StarterInit(data['list']);
    },error=>{
        this.catalogService.alertMessage("서버가 불안정합니다.",false);
      });
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS).subscribe(data => {
      this.BuildInit(data['list']);
    },error=>{
      this.catalogService.alertMessage("서버가 불안정합니다.",false);
    });
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS).subscribe(data => {
      this.ServiceInit(data['list']);
    },error=>{
      this.catalogService.alertMessage("서버가 불안정합니다.",false);
    });
    this.catalogService.getRecentPacks('/commonapi/v2/'+this.userid+'/history').subscribe(data => {
      this.RecentInit(data['list']);
    },error=>{
      this.catalogService.alertMessage("서버가 불안정합니다.",false);
    });
    this.catalogService.check = true;
  }

  Search()  {
    this.searchKeyword = $("#catalog-search").val();
    console.log(this.searchKeyword);
    this.SearchStarterPack();
    this.SearchBuildPack();
    this.SearchServicePack();
  }

  goStarter(starter : any) {
    this.catalogService.setCurrentCatalogNumber(starter.no);
    this.router.navigate(['catalogdetail']);
  }

  goDevelopMent(build : any) {
    this.catalogService.setCurrentCatalogNumber(build.no);
    this.router.navigate(['catalogdevelopment']);
  }

  goService(service : any) {
    this.catalogService.setCurrentCatalogNumber(service.no);
    this.router.navigate(['catalogservice']);
  }

  goHistory(any : any){
    const classification = any['classification'];
    if(classification.includes("starter_")){
      this.catalogService.setCurrentCatalogNumber(any['no']);
      this.router.navigate(['catalogdetail']);
    }
    else if(classification.includes("buildpack_")){
      this.catalogService.setCurrentCatalogNumber(any['no']);
      this.router.navigate(['catalogdevelopment']);
    }
    else if(classification.includes("service_")){
      this.catalogService.setCurrentCatalogNumber(any['no']);
      this.router.navigate(['catalogservice']);
    }
  }

  private jsonParse(value) : any{
    let result = '';
    let json = JSON.parse(value.tagsParam);
    value.buttonclass = new Array<any>();
    const keys = Object.keys(json);
    keys.forEach(key => {
      const buttonclass = 'btns3 ' + json[key];
      const buttonvalue = key;
      let array = {buttonclass, buttonvalue};
      value.buttonclass.push(array);
    })
    return value;
}

  RecentInit(data : any) {
    this.catalogService.recentpacks = new Array<any>();
    data.forEach(a => {
      a = this.jsonParse(a);
    });
    this.catalogService.starterpacks.forEach(recent => {
      var pathHeader = recent.thumbImgPath.lastIndexOf("/");
      var pathEnd = recent.thumbImgPath.length;
      var fileName = recent.thumbImgPath.substring(pathHeader + 1, pathEnd);
      recent.thumbImgPath = CATALOGURLConstant.GETIMG+fileName;
    });
    this.catalogService.recentpacks = data;

  }

  StarterInit(data : any) {
    this.catalogService.starterpacks = new Array<any>();
    this.catalogService.starterpacks = data.filter(a => { if(a.useYn === CATALOGURLConstant.YN){return a; }});
    this.catalogService.starterpacks.forEach(a => {
      a = this.jsonParse(a);
    });
    this.catalogService.starterpacks.forEach(starter => {
      var pathHeader = starter.thumbImgPath.lastIndexOf("/");
      var pathEnd = starter.thumbImgPath.length;
      var fileName = starter.thumbImgPath.substring(pathHeader + 1, pathEnd);
      starter.thumbImgPath = CATALOGURLConstant.GETIMG+fileName;
    });
    this.catalogService.viewstarterpacks = this.catalogService.starterpacks;

  }

  BuildInit(data : any) {
    this.catalogService.buildpacks = new Array<any>();
    this.catalogService.buildpacks = data.filter(a => { if(a.useYn === CATALOGURLConstant.YN){return a; }});
    this.catalogService.buildpacks.forEach(a => {
      a = this.jsonParse(a);
    });
    this.catalogService.buildpacks.forEach(buildpack => {
      var pathHeader = buildpack.thumbImgPath.lastIndexOf("/");
      var pathEnd = buildpack.thumbImgPath.length;
      var fileName = buildpack.thumbImgPath.substring(pathHeader + 1, pathEnd);
      buildpack.thumbImgPath = CATALOGURLConstant.GETIMG+fileName;
    });
    this.catalogService.viewbuildpacks = this.catalogService.buildpacks;
  }

  ServiceInit(data : any) {
    this.catalogService.servicepacks = new Array<any>();
    this.catalogService.servicepacks = data.filter(a => { if(a.useYn === CATALOGURLConstant.YN){return a; }});
    this.catalogService.servicepacks.forEach(a => {
      a = this.jsonParse(a);
    });
    this.catalogService.servicepacks.forEach(servicepack => {
      var pathHeader = servicepack.thumbImgPath.lastIndexOf("/");
      var pathEnd = servicepack.thumbImgPath.length;
      var fileName = servicepack.thumbImgPath.substring(pathHeader + 1, pathEnd);
      servicepack.thumbImgPath = CATALOGURLConstant.GETIMG+fileName;
    });
    this.catalogService.viewservicepacks = this.catalogService.servicepacks;
  }
  SearchStarterPack() {
    this.catalogService.viewstarterpacks = new Array<any>();
    let view = this.catalogService.viewstarterpacks;
    const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.starterpacks.forEach(function (starterpack) {
      if ((starterpack.description.toLocaleLowerCase().indexOf(keyword) != -1) || (starterpack.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (starterpack.name.toLocaleLowerCase().indexOf(keyword) != -1)) {
        view.push(starterpack);
      }
    });
  }

    SearchBuildPack() {
      this.catalogService.buildPackFilter();
      const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.viewbuildpacks = this.catalogService.viewbuildpacks.filter(data => {
      if((data.description.toLocaleLowerCase().indexOf(keyword) != -1) || (data.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (data.name.toLocaleLowerCase().indexOf(keyword) != -1)){
        return data;
      }
    });
    }

  SearchServicePack() {
    this.catalogService.servicePackFilter();
    const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.viewservicepacks = this.catalogService.viewservicepacks.filter(data => {
      if((data.description.toLocaleLowerCase().indexOf(keyword) != -1) || (data.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (data.name.toLocaleLowerCase().indexOf(keyword) != -1)){
        return data;
      }
    });
  }
}


