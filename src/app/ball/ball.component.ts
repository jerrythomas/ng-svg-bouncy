import { Component, OnInit, HostListener ,ElementRef, ViewChild} from '@angular/core';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import {DeviceData} from '../device-data';

import { KeyCodes } from '../key-codes.enum'

import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'svg:[wall] ',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  gravity = 1;
  radius: number=40;
  x: number= 20;
  y: number= 20;
  paused: boolean = true;
  gravitySpeed = 0.2;
  speedX;
  speedY;
  bounce;
  height; 
  width;
  moveInterval: Subscription;
  ballType: string = '';
  deviceInfo: DeviceData = new DeviceData();

  private capture: boolean = false;
  private trigger: Subject<void> = new Subject<void>();
  private captureTimer: Subscription;
  private currentIndex: number = -1; 
  //private poseData: BallPose;

  //@ViewChild('canvas') canvasEl: ElementRef;
  //private context: CanvasRenderingContext2D;
  
  constructor(private elRef:ElementRef, private deviceService: DeviceDetectorService) { 
    this.deviceInfo.screenHeight = screen.height;
    this.deviceInfo.screenWidth = screen.width;
    this.deviceInfo.userAgent = this.deviceService.ua;

    this.deviceInfo.category = 'unknown'
    if (this.deviceService.isMobile())
      this.deviceInfo.category = 'mobile';
    else if (this.deviceService.isTablet())
      this.deviceInfo.category = 'tablet';
    else if (this.deviceService.isDesktop())
      this.deviceInfo.category = 'desktop';
    
    console.log(this.deviceService.getDeviceInfo(), this.deviceInfo);
  }

  @ViewChild('ball')
  ballElement: ElementRef;

  ngOnInit() {
    
    this.speedY = 0.1;
    this.bounce = 1.02;
    this.x = this.radius;
    this.y = this.radius;
    
  }
  

  position(): string {
    //console.log("translate("+this.x+ ", "+ this.y+")");
    return "'translate('" + this.x + "'px, '"+ this.y+"'px)'";
  }

  @HostListener('window:keyup', ['$event'])
  toggleTimedCapture(event: KeyboardEvent) {
    this.width =  this.elRef.nativeElement.width.baseVal.value - this.radius;
    this.height =  this.elRef.nativeElement.height.baseVal.value - this.radius;
    this.speedX = Math.cos(15 * (Math.PI/180)) * (this.width/this.height) * 3;
    if (   event.keyCode === KeyCodes.SPACE_BAR 
        || event.keyCode === KeyCodes.RETURN) {

      if (this.paused) {
        this.moveInterval = timer(0, 12).subscribe(() => {
          this.nextPosition();
          this.trigger.next();
        })
      }
      else {
        this.moveInterval.unsubscribe();
      }
      this.paused = !this.paused
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth - this.radius;
    this.height =  event.target.innerHeight - this.radius;
    this.speedX = Math.cos(15 * (Math.PI/180)) * (this.width/this.height);
    console.log(this.speedX);
  }

  nextPosition(){
    
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY * this.gravitySpeed;

    if (this.x < this.radius && this.speedX < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y < this.radius) {
      this.y = this.radius
      this.gravitySpeed = .2*this.bounce;
    }
    if (this.y > this.height) {
      this.y = this.height;
      this.gravitySpeed = -(this.gravitySpeed*this.bounce);
      //this.bounce = -this.bounce
    }
    if (this.x > this.width && this.speedX > 0) {
        this.speedX = -this.speedX;
    }
    var top = this.y - this.radius;
    var left = this.x - this.radius;
    
    this.ballElement.nativeElement.setAttribute('transform', "translate(" + left + ", "+ top +" )")
    //console.log(this.x, this.y, this.width, this.height);
  }
  ngAfterViewInit() {
    //this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    //this.context.draw();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}