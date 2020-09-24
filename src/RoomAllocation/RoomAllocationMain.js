import React,{Component} from "react";
import TagOnly from "./TagOnly";
import TagAndSub from "./Tag&Sub";
import LecturerRoomAll from "./Lecturer";
import GroupAndSub from "./GroupAndSub";
import Sessions from "./Sessions";
import UnavailableTimes from "./UnavailableTimes";

class RoomAllocationMain extends Component{
    constructor(props) {
        super(props);

        this.state={
            current: 'Tag'
        }
        this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
    }


    onChangeRadioButton(e){
        this.setState({
            current:e.target.value
        })
        this.render();
    }

    SwitchInside(current){
       switch (current) {
           case 'Tag' : return <TagOnly/>;break;
           case 'T&S' : return <TagAndSub/>;break;
           case 'lec': return <LecturerRoomAll/>;break;
           case 'group': return <GroupAndSub/>;break;
           case 'session': return <Sessions />;break
           case 'unavailable': return <UnavailableTimes />;break

       }
    }
    render() {
        return (
        <div className='main'>
             <h3>Room Allocation</h3>
            <div className="form " style={{marginLeft:'10em',width:'60%'}}>


                <h5>Select an option to allocate rooms : </h5>
                <div className="form-check form-check-inline mx-sm-3 mb-2 mr-2">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="Tag" onChange={this.onChangeRadioButton} checked={this.state.current == 'Tag'}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Tag</label>
                    &nbsp;&nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="T&S" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Tag &Subject</label>
                    &nbsp;&nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="lec" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Lecturer</label>
                    &nbsp;&nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="group" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Group/Subgroup</label>
                    &nbsp; &nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="session" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Session</label>
                    &nbsp; &nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="unavailable" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Unavailable</label>
                </div>

                {this.SwitchInside(this.state.current)}


            </div>
</div>
        );
    }
}
export default RoomAllocationMain;
