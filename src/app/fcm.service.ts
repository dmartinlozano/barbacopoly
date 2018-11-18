import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { CredentialsService } from './app.credentials.service';
import { NativeStorageService}  from './app.native.storage.service';
import * as SNS from 'aws-sdk/clients/sns';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  applicationFcmArn: string;
  token: string;
  idDevice: string;
  endPointArn: string;
  topicArn: string;
  sns;

  constructor(
    private firebaseNative: Firebase,
    private uniqueDeviceId: UniqueDeviceID,
    private credentialsService: CredentialsService,
    private nativeStorageService: NativeStorageService
  ) {
    this.sns = new SNS({
      accessKeyId: this.credentialsService.credentials["aws_access_key_id"],
      secretAccessKey: this.credentialsService.credentials["aws_secret_access_key"],
      region: this.credentialsService.credentials["region"]
    });
  }

  // Add subscription to aws sns, which is connected to firebase
  async getToken() {  
    try{
      this.token = await this.firebaseNative.getToken();  
      this.idDevice = await this.uniqueDeviceId.get();
      //get endpoint platform
      this.applicationFcmArn = this.credentialsService.credentials["application_fcm_arn"];
      try{
        let endPointArn = await this.nativeStorageService.getItem("endPointArn");
        this.endPointArn = endPointArn;
        console.log("endPointArn 1: "+endPointArn)
      }catch(e){
         //create endpoint platform
         let endPointData = await this.createEndPointAwsSns();
         this.endPointArn = endPointData.EndpointArn;
         console.log("endPointArn 2: "+this.endPointArn)
         this.nativeStorageService.setItem("endPointArn",this.endPointArn);
      }

      //subscribe to particular topic
      this.topicArn = this.credentialsService.credentials["topic_fcm_arn"];
      await this.subscribeTopic();
      this.nativeStorageService.setItem("susbscriptionArnEnabled",true);
    }catch(e){
      this.nativeStorageService.setItem("susbscriptionArnEnabled",false);
      console.error(e);
    }
    
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }


  async createEndPointAwsSns(){
    const params={
      PlatformApplicationArn: this.applicationFcmArn,
      Token : this.token,
      CustomUserData : this.idDevice,
      Attributes:{}
    }
    return await this.sns.createPlatformEndpoint(params).promise();
  }

  async subscribeTopic(){
    const params = {
      Protocol: 'application',
      TopicArn: this.topicArn,
      Endpoint: this.endPointArn
    };
    return await this.sns.subscribe(params).promise();
  }
}
