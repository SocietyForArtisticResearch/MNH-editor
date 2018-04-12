import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCMedia, RCVideo } from '../../shared/rcexposition';
import { FormControl, AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Backend } from '../../shared/Backend'

import * as Utils from '../../shared/utils'

import { BasicToolComponent } from '../basic-tool/basic-tool.component';

@Component({
    selector: 'app-video-tool',
    templateUrl: './video-tool.component.html',
    styleUrls: ['./video-tool.component.css']
})
export class VideoToolComponent extends BasicToolComponent {
    constructor(private http: HttpClient, private rcExpoModel: RCExpoModel) { 
        super();
    }

    prepareSaveObject(): RCVideo {
        const formModel = this.toolForm.value;

        let id = Utils.uniqueID();
        const newObject: RCVideo = new RCVideo(id, formModel.name);
        newObject.url = formModel.videoUrl;
        newObject.pxWidth = formModel.widthInPixels;
        newObject.pxHeight = formModel.heightInPixels;
        return newObject;
    }
}

