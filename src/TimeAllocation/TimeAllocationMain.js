import React,{Component} from "react";
import LecturerNA from "./LecturerNA";
import Session from "./SessionNA";
import Group from "./GroupNA";
import TimeNav from "./timeNav.js";


class TimeAllocationMain extends Component{
    constructor(props) {
        super(props);

        this.state={
            current: "LecturerNA"
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
            case 'LecturerNA' : return <LecturerNA/>;break;
            case 'SessionNA' : return <Session/>;break;
            case 'GroupNA': return <Group/>;break;

        }
    }
    render() {
        return (

            <div className='main'>
                <TimeNav/>

                <h3>Time Allocation</h3>
                <div className="form " style={{marginLeft:'10em',width:'60%'}}>


                    <h5>Select an option to Allocate Time : </h5>
                    <div className="form-check form-check-inline mx-sm-3 mb-2 mr-2">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="LecturerNA" onChange={this.onChangeRadioButton}/>
                        <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Lecturer</label>
                        &nbsp;&nbsp;
                        <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="SessionNA" onChange={this.onChangeRadioButton}/>
                        <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Session</label>
                        &nbsp;&nbsp;
                        <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="GroupNA" onChange={this.onChangeRadioButton}/>
                        <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>Group</label>

                    </div>

                    {this.SwitchInside(this.state.current)}


                </div>
            </div>
        );
    }
}
export default TimeAllocationMain;
