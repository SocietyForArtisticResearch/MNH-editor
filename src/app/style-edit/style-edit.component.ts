import { Component, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { RCExpoModel } from "../shared/RCExpoModel";

declare var CodeMirror;

@Component({
  selector: 'app-style-edit',
  templateUrl: './style-edit.component.html',
  styleUrls: ['./style-edit.component.css']
})
export class StyleEditComponent implements AfterViewInit {
 	@ViewChild('styleEditBox') textarea: ElementRef;

 	editor :any;

  @Output() closeWindow = new EventEmitter();

  constructor(private rcExpoModel: RCExpoModel) { }


  ngAfterViewInit() {
  	this.editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
    	mode: "text/css",
  	});
    // puts curser in box
    this.editor.focus();
    // note that codemirror does not use textarea for value exchange
    this.editor.setValue(this.rcExpoModel.exposition.style.replace(';',';\n'));
  }

  updateStyle() {
    console.log('update style');
    this.rcExpoModel.exposition.style = this.editor.getValue();
    this.rcExpoModel.mde.updateStyling();
    this.closeWindow.emit();
  }
}
