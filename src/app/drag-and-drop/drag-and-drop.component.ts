import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';
import { Backend } from '../shared/Backend';
import { RCExpoModel } from '../shared/RCExpoModel';
import { RCImage, RCObject, RCAudio, RCVideo, RCPdf } from '../shared/rcexposition';
import { RCMDE, insertMedia } from '../shared/rcmde';
import * as Utils from '../shared/utils';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RCBackendMediaUpload } from '../shared/RCBackendMediaUpload';
//import { BlobMimeDetect } from '../shared/BlobMimeDetect';

@Component({
    selector: 'app-drag-and-drop',
    templateUrl: './drag-and-drop.component.html',
    styleUrls: ['./drag-and-drop.component.css'],
})
export class DragAndDropComponent implements OnInit {
    @Output() onChangedObject = new EventEmitter<number>();
    @Input() isBigger: boolean;
    @Input() isMediaInserted: boolean;

    fileUploadStatus: string = null;

    constructor(
        private http: HttpClient,
        private rcExpoModel: RCExpoModel,
        private backendUpload: RCBackendMediaUpload
    ) { }

    ngOnInit() {

    }

    uploadFileRC(fileList: FileList) {
        this.fileUploadStatus = 'upload in progress';

        if (fileList.length > 0) {
            let onRCResult = ( evt :any ) => { this.onRCResult(evt) };
            let onProgress = ( progress: string ) => { this.fileUploadStatus = progress };
            this.backendUpload.uploadFile(fileList,onRCResult,onProgress);
        }
    }


    onFilesChange(fileList: FileList) {
        this.fileUploadStatus = 'upload in progress';

        if (Backend.useRC) { 
            let onResult = ( result ) => { this.onRCResult(result); };
            let onProgress = ( progress ) => { this.fileUploadStatus = progress; };

            this.backendUpload.uploadFile(fileList, onResult, onProgress);
        } else {

            if (fileList.length > 0) {

                let selectedFile = fileList[0];

                const fd = new FormData();
                fd.append('uploadFile', selectedFile, selectedFile.name);

                const req = new HttpRequest('POST', Backend.uploadAddress, fd, {
                    reportProgress: true,
                });

                this.http.request(req).subscribe(event => {
                    // Via this API, you get access to the raw event stream.
                    // Look for upload progress events.
                    if (event.type === HttpEventType.UploadProgress) {
                        // This is an upload progress event. Compute and show the % done:
                        this.fileUploadStatus = 'uploading ' + Math.round(100 * event.loaded / event.total) + '%';
                    } else if (event instanceof HttpResponse) {
                        this.fileUploadStatus = 'done';
                        window.setTimeout(() => { this.fileUploadStatus = null }, 1000);
                        this.onResult(event.body);
                    }
                });
            }
        }
    }

    onRCResult(result) {
        try {
            let rcobject = this.rcExpoModel.exposition.updateOrCreateObject(result);

            this.onChangedObject.emit(rcobject.id);
        }
        catch (error) {
            console.log('an error occured trying to insert the uploaded media',error);
        }

    }

    onResult(result) {
        // note: this is old server.js response handling, not RC Simple Media (see onRCResult)
        let mimeType = result.mime;
        if (!mimeType) {
            mimeType = '';
        }

        let newRCObject: RCObject = null;

        if (mimeType.includes('image')) {
            let imageName = 'image' + this.rcExpoModel.exposition.media.length;
            let imageUri = Backend.baseAddress + result.url;
            newRCObject = new RCImage(Utils.uniqueID(), imageName);
            newRCObject.url = imageUri;
        } else if (mimeType.includes('audio')) {
            let audioName = 'audio' + this.rcExpoModel.exposition.media.length;
            let audioUri = Backend.baseAddress + result.url;
            newRCObject = new RCAudio(Utils.uniqueID(), audioName);
            newRCObject.url = audioUri;
        } else if (mimeType.includes('video')) {
            let videoName = 'video' + this.rcExpoModel.exposition.media.length;
            let videoUri = Backend.baseAddress + result.url;
            newRCObject = new RCVideo(Utils.uniqueID(), videoName);
            newRCObject.url = videoUri;
        } else if (mimeType.includes('pdf')) {
            let pdfName = 'pdf' + this.rcExpoModel.exposition.media.length;
            let pdfUri = Backend.baseAddress + result.url;
            newRCObject = new RCPdf(Utils.uniqueID(), pdfName);
            newRCObject.url = pdfUri;
        } else {
            console.log('do not know what to do with mimeType: ', mimeType);
        }

        newRCObject.pxWidth = null;
        newRCObject.pxHeight = null;

        newRCObject.copyright = '';
        newRCObject.description = '';

        this.rcExpoModel.exposition.addObject(newRCObject);
        this.onChangedObject.emit(newRCObject.id);
    }

    onClick() {
        window.document.getElementById('dropzone-manual-input').click();
    }

    onFileSelected($event) {
        //this.uploadFileRC($event.target.files);
        this.onFilesChange($event.target.files);
    }

}
