import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCBackendMediaUpload } from './shared/RCBackendMediaUpload';
import { RCMDE, insertMediaToken, insertMedia } from './shared/rcmde';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';
import { ObjectListComponent } from './object-list/object-list.component';
import { MarkdownToolComponent } from './tools/markdown-tool/markdown-tool.component';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';





@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [RCExpoModel, RCBackendMediaUpload]
})
export class AppComponent implements OnInit {
    @HostListener('window:beforeunload', ['$event'])
    respondToUnload($event) {
        alert("don't do it !");
        $event.returnValue='Your data will be lost!';
    }
    // rcExpoModel is injected into this compenent (and all its children through their constructors !)
    showMedia: boolean = false;
    showImport: boolean = false;
    editStyle: boolean = false;
    loadedExpositionURL$: Observable<any>;
    styleButtonMessage: string = "Edit style";

    @ViewChild(ObjectListComponent) objectList: ObjectListComponent;
    @ViewChild(MarkdownToolComponent) markdownEditor: MarkdownToolComponent;

    constructor(
        public rcExpoModel: RCExpoModel,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    onMediaButton() {
        this.showMedia = !this.showMedia;
        if (this.objectList) {
            this.objectList.whenOpened();
        }
        if (this.showMedia) {
            var element = window.document.getElementById('mediaPanel');
            element.focus();
        }
    }

    toggleStyle() {
        this.editStyle = !this.editStyle;
        this.styleButtonMessage = "Edit text";
    }

    onChangedObject(identity) {
        let rcobject = this.rcExpoModel.exposition.getObjectWithID(identity);
        let editor: RCMDE = this.rcExpoModel.mde;
        this.objectList.onChangedObject(identity); // to update selected tool to newest in the object list.
        insertMedia(editor, rcobject.name);
    }

    closeMedia() {
        this.showMedia = false;
        this.markdownEditor.refocus();
    }

    getParam(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var params = url[i].split("=");
            if (params[0] == param)
                return params[1];
        }
        return '';
    }

    ngOnInit() {
        /* this was an attempt to use the angular router to grab an ExpositionURL 
          this.loadedExpositionURL$ = this.route.params
          .pipe(switchMap((params: Params) =>
                {
                    console.log("these are the params :",params);
                    let url = params.get('expositionUrl')
                     rcExpoModel.loadExpositionFromURL(url)
                 })); */
        let url = this.getParam('expositionUrl');
        let rcId = this.getParam('research');

        if (rcId) {
            let rcIdNumber = Number(decodeURIComponent(rcId));
            this.rcExpoModel.loadExpositionFromRC(rcIdNumber);
        } else if (url) {
            url = decodeURIComponent(url);
            this.rcExpoModel.loadExpositionFromURL(url);
        }
    }

    shouldHideBecauseModalIsVisible() {
        if (this.showMedia || this.showImport || this.editStyle) {
            return true;
        }
        return false;
    }


}
