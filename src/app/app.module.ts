import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ScadaComponent } from './scada/scada.component';
import { HorizontalPipeComponent } from './scada/horizontal-pipe/horizontal-pipe.component';
import { VerticalPipeComponent } from './scada/vertical-pipe/vertical-pipe.component';
import { TopValveComponent } from './scada/top-valve/top-valve.component';
import { BottomValveComponent } from './scada/bottom-valve/bottom-valve.component';
import { RightValveComponent } from './scada/right-valve/right-valve.component';
import { LeftValveComponent } from './scada/left-valve/left-valve.component';
import { CrosspipeComponent } from './scada/crosspipe/crosspipe.component';
import { TopTwayComponent } from './scada/top-tway/top-tway.component';
import { BottomTwayComponent } from './scada/bottom-tway/bottom-tway.component';
import { RightTwayComponent } from './scada/right-tway/right-tway.component';
import { LeftTwayComponent } from './scada/left-tway/left-tway.component';
import { LeftTopElbowComponent } from './scada/left-top-elbow/left-top-elbow.component';
import { RightTopElbowComponent } from './scada/right-top-elbow/right-top-elbow.component';
import { LeftBottomElbowComponent } from './scada/left-bottom-elbow/left-bottom-elbow.component';
import { RightBottomElbowComponent } from './scada/right-bottom-elbow/right-bottom-elbow.component';
import { VerticalTankComponent } from './scada/vertical-tank/vertical-tank.component';
import { HorizontalTankComponent } from './scada/horizontal-tank/horizontal-tank.component';
import { CutawayComponent } from './scada/cutaway/cutaway.component';
import { PumpComponent } from './scada/pump/pump.component';
import { PipeEndBottomComponent } from './scada/pipe-end-bottom/pipe-end-bottom.component';
import { PipeEndTopComponent } from './scada/pipe-end-top/pipe-end-top.component';
import { PipeEndRightComponent } from './scada/pipe-end-right/pipe-end-right.component';
import { PipeEndLeftComponent } from './scada/pipe-end-left/pipe-end-left.component';
import { VerticalRotorComponent } from './scada/vertical-rotor/vertical-rotor.component';
import { HorizontalRotorComponent } from './scada/horizontal-rotor/horizontal-rotor.component';
import { TopElbowComponent } from './scada/top-elbow/top-elbow.component';


@NgModule({
  declarations: [
    AppComponent,
    ScadaComponent,
    HorizontalPipeComponent,
    VerticalPipeComponent,
    TopValveComponent,
    BottomValveComponent,
    RightValveComponent,
    LeftValveComponent,
    CrosspipeComponent,
    TopTwayComponent,
    BottomTwayComponent,
    RightTwayComponent,
    LeftTwayComponent,
    LeftTopElbowComponent,
    RightTopElbowComponent,
    LeftBottomElbowComponent,
    RightBottomElbowComponent,
    VerticalTankComponent,
    HorizontalTankComponent,
    CutawayComponent,
    PumpComponent,
    PipeEndBottomComponent,
    PipeEndTopComponent,
    PipeEndRightComponent,
    PipeEndLeftComponent,
    VerticalRotorComponent,
    HorizontalRotorComponent,
    TopElbowComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
