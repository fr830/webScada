import { Component } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    subject: Subject<any> = new Subject();

    public templateArray: Array<string>;
    this.templateArray = [
				"horizontal-pipe",
				"vertical-pipe",
				"top-valve",
				"bottom-valve",
				"right-valve",
				"left-valve",
				"crosspipe",
				"top-tway",
				"bottom-tway",
				"right-tway",
				"left-tway",
				"left-top-elbow",
				"right-top-elbow",
				"left-bottom-elbow",
				"right-bottom-elbow",
				"vertical-tank",
				"horizontal-tank",
				"cutaway",
				"pump",
				"pipe-end-bottom",
				"pipe-end-top",
				"pipe-end-right",
				"pipe-end-left",
				"vertical-rotor",
				"horizontal-rotor"
			];

    constructor( public http: Http){
    	/*this.templateArray.map( name => {
    		this.getTemplate( './template/' + name + '.html');
    	});*/
    	for( let i; i < this.templateArray.length; i++) {
    		this.getTemplate( './template/' + this.templateArray[i] + '.html');
    	}
    }

    public getTemplate( url: string): any{
    	return this.http.get( url).subscribe( data => {
    		console.log( data);
    	});
    }

}
