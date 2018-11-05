import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  maxResults :number= 30;
  defaultUrlApi :string= "https://www.googleapis.com/drive/v2/files?key=AIzaSyC1-QV2OgsFo43c7RUT3tA4BIZVku2UXME&spaces=drive&q=%271g3z3Bb0ibcoWLAo3GJOWRKDOSDlImlTO%27+in+parents";

  constructor(private http:HttpClient) { }

  async list(isAsc: boolean, nextPageToken: string){
    let url = this.defaultUrlApi;
    url +="&maxResults="+this.maxResults;
    if (isAsc === true){
      url +="&orderBy=modifiedDate asc";
    }else{
      url +="&orderBy=modifiedDate desc"
    }
    if (nextPageToken != null){
      url +="&pageToken="+nextPageToken;
    }
    const result = await this.http.get(url).toPromise();
    return {"nextPageToken":result["nextPageToken"],"items":result["items"]}
  }

}
