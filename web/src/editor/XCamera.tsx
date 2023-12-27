import React from 'react';
import {XBaseEditorProps, XButton, XCard,  XFlex, XMessage, XSelectList} from "../index";
import PropTypes from "prop-types";
import XBaseEditor from "../base/XBaseEditor";
import XGrid from "../layout/XGrid";
export interface XCameraProps extends XBaseEditorProps {
    /**
     * 上传Url
     */
    uploadUrl: string,
    /**
     * 文件上传事件
     */
    onFileUpload?: Function,
    /**
     * 显示上传按钮
     */
    showUpload?: boolean,
    /**
     * 自动流模式
     */
    autoScream?: boolean,
    /**
     * 自动流回调
     */
    autoScreamFunc?: Function,
    /**
     * 拍照回调事件
     */
    onPicCaptureFunc?: Function,
    /**
     * 相机关闭事件
     */
    onClose?: Function,
}
export default class XCamera extends XBaseEditor<XCameraProps, any> {

    static defaultProps = {
        ...XBaseEditor.defaultProps,
        uploadUrl: "xtpz/upload",
        onPicCaptureFunc: undefined,
        onFileUpload: undefined,
        showUpload: true,
        autoScream: false,
    };

    constructor(props) {
        super(props);
        this.state.defalutSelectedDevice = ''
        this.state.mediaDeviceList = []
        this.state.deviceId = ""
        this.state.mediaStream = null
        this.state.deviceActive = false
        this.state.tips = ""
    }
    
    autoScreamFunc?:any;
    picCaptureStart?:boolean;

    componentDidMount() {
        console.log(navigator)
        this.setDeviceList();
        if (this.props.autoScream && this.props.autoScreamFunc) {
            this.picCaptureStart = true;
            this.autoScreamFunc = setInterval(async () => {
                if (this.state.deviceActive && this.picCaptureStart) {
                    this.picCaptureStart = false;
                    let canvas:any = document.getElementById("canvas")
                    let video = document.getElementById('video');
                    let context = canvas?.getContext('2d');
                    if (canvas && video && context) {
                        context?.drawImage(video, 0, 0, video?.clientWidth, video?.clientHeight);
                        if (!this.isCanvasBlank(canvas)) {
                            // @ts-ignore
                            await this.props.autoScreamFunc(canvas.toDataURL("image/jpg"));
                        }
                    }
                    this.picCaptureStart = true;
                }
            }, 500);
        }
    }

    //连接相机
    connectDevice = (deviceId?:any) => {
        //先关闭当前正在运行摄像头
        if (null != this.state.mediaStream) {
            this.onCloseDevice();
        }
        //打开新选择摄像头
        // @ts-ignore
        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            //调用用户媒体设备, 访问摄像头，设置摄像头参数
            this.getUserMedia({
                video: {
                    width: 1440,
                    height: 960,
                    deviceId: {exact: deviceId}
                }
            }, this.success, this.error);
        } else {
            XMessage.ShowWarn('不支持访问用户媒体');
        }
    };
    //获取设备列表并设置到设备列表
    setDeviceList = async () => {
        let deviceArray = await navigator.mediaDevices.enumerateDevices();
        if (deviceArray.length > 0) {
            let mediaDeviceList:any = [];
            for (let i in deviceArray) {
                if (deviceArray[i].kind == 'videoinput') {
                    let obj = {
                        "value": deviceArray[i].deviceId,
                        "label": deviceArray[i].label
                    };
                    mediaDeviceList.push(obj);
                }
            }
            //判断是否有可用的视频输入设备
            if (mediaDeviceList.length > 0) {
                this.setState({
                    mediaDeviceList,
                    timeKey: new Date().getTime(),
                    defalutSelectedDevice: mediaDeviceList[0].value,
                    deviceId: mediaDeviceList[0].value
                });
                this.connectDevice();
            } else {
                this.setState({
                    tips: "没有可用照片采集设备或者浏览器不支持此功能，请保证设备可正常使用(此方式不支持IE浏览器)"
                });
            }
        } else {
            XMessage.ShowWarn("没有可用设备或设备不可用！");
        }
    };
    //访问用户媒体设备的兼容方法
    getUserMedia = (constraints, success, error) => {
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
            // @ts-ignore
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            // @ts-ignore
            navigator.webkitGetUserMedia(constraints, success, error)
            // @ts-ignore
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            // @ts-ignore
            navigator.mozGetUserMedia(constraints, success, error);
            // @ts-ignore
        } else if (navigator.getUserMedia) {
            //旧版API
            // @ts-ignore
            navigator.getUserMedia(constraints, success, error);
        }
    };
    //成功回调
    success = (stream) => {
        let video:any = document.getElementById('video');
        let canvas = document.getElementById('canvas');
        //兼容webkit核心浏览器
        let CompatibleURL = window.URL || window.webkitURL;
        //将视频流设置为video元素的源
        this.setState({mediaStream: stream, deviceActive: true});
        //video.src = CompatibleURL.createObjectURL(stream);
        try {
            video.srcObject = stream;
            video.play();
        } catch (e) {
        }
    };
    //失败回调
    error = (error) => {
        console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    };
    //拍照预览
    takePicturePreView = () => {
        let video:any = document.getElementById('video');
        let canvas:any = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        if (context && video && canvas) {
            context?.drawImage(video, 0, 0, video?.clientWidth, video?.clientHeight);
            this.props.onPicCaptureFunc && this.props.onPicCaptureFunc(canvas.toDataURL("image/jpg"));
        }
    };

    componentWillUnmount() {
        super.componentWillUnmount();
        this.onCloseDevice();
        clearInterval(this.autoScreamFunc);
        this.autoScreamFunc = null;
    }

    //关闭摄像头
    onCloseDevice = () => {
        //关闭
        let stream = this.state.mediaStream;
        if (stream == null) {
            return;
        }
        if (stream.active == true) {
            let track = stream.getTracks()[0];
            track.stop();
            this.setState({deviceActive: false});
        }
    };

    //最终关闭
    closeAll = () => {
        //首先关闭设备
        this.onCloseDevice();
        //关闭窗口
        if (typeof (this.props.onClose) != 'undefined') {
            this.props.onClose();
        }
    }

    //得到图片资源
    getPicData = () => {
        let success = false;
        let canvas:any = document.getElementById('canvas');
        if (!this.isCanvasBlank(canvas)) {
            let imgData = canvas.toDataURL("image/jpg");
            return imgData;
        } else {
            XMessage.ShowWarn("请先抓取照片！");
        }
        return success;
    };
    //打开设备
    openDevice = () => {
        if (this.state.deviceId != "") {
            this.connectDevice();
        } else {
            XMessage.ShowWarn("当前设备不可用,请选择设备！");
        }
    };
    //验证canvas画布是否为空函数
    isCanvasBlank = (canvas) => {
        var blank = document.createElement('canvas');//系统获取一个空canvas对象
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() == blank.toDataURL();//比较值相等则为空
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.objectEqual(this.props, nextProps) &&
            this.objectEqual(this.state, nextState)
        ) {
            return false;
        }
        return true;
    }

    objectEqual(cure, next) {
        for (let i in cure) {
            if (!Object.is(cure[i], next[i])) {
                return false;
            }
        }
        return true;
    }

    async uploadFile() {
        const base64 = this.getPicData();
        if (base64) {
            // @ts-ignore
            function base64toFile(dataurl, filename = 'file') {
                let arr = dataurl.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let suffix = mime.split('/')[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                return new File([u8arr], `${filename}.${suffix}`, {
                    type: mime
                })
            }
            let file = base64toFile(base64, "test.png");
            let data = new FormData();
            data.append("file", file);
            const ret = await this.RequestUploadFile(this.props.uploadUrl, data, true)
            return ret;
        }
    }

    render() {
        return <XGrid columnsTemplate={['auto', 'auto']} height={"auto"} columnGap={"20px"}>
            <XGrid rowsTemplate={['120px', 'auto']}>
                <XCard title="设备列表" paddingTRBL={"0px 0px 0px 0px"}>
                    <XFlex columnGap="5px">
                        <XSelectList field={"设备列表"} onChange={(value) => {
                            this.setState({
                                defalutSelectedDevice: value,
                            });
                            this.connectDevice(value);
                        }} notFoundContent="没有可用的设备" displayField={"label"} valueField={"value"}
                                     editItems={false} items={this.state.mediaDeviceList}
                                     value={this.state.defalutSelectedDevice} showLabel={false}
                                     key={this.state.timeKey}/>
                        <XButton disabled={this.state.deviceActive} onClick={() => this.openDevice()}
                                 text={"打开设备"}/>
                        <XButton disabled={!this.state.deviceActive} visible={!this.props.autoScream}
                                 onClick={() => this.takePicturePreView()}
                                 text={"拍照"}/>
                        <XButton disabled={!this.state.deviceActive} onClick={() => this.onCloseDevice()}
                                 text={"关闭设备"}/>
                    </XFlex>
                </XCard>
                <video id="video" style={{zIndex: 1000}} width="300px" height="auto"/>
            </XGrid>
            <XGrid rowsTemplate={['120px', 'auto']} paddingTRBL={"0px 0px 0px 0px"}>
                <XCard title="拍照预览">
                    <XFlex>
                        <XButton text={"下载图片"} isA={true} onClick={() => {
                            let dlLink = document.createElement('a');
                            dlLink.download = "image";
                            dlLink.href = this.getPicData();
                            dlLink.click();
                        }}/>
                        <XButton text={"上传图片"} visible={this.props.showUpload} onClick={async () => {
                            const ret = await this.uploadFile()
                            this.props.onFileUpload && this.props.onFileUpload(ret);
                        }}/>
                    </XFlex>
                </XCard>
                <canvas id="canvas" width="300px" height="170px"></canvas>
                {/*<canvas id="canvas_virtual" style={{display: "none"}}></canvas>*/}
            </XGrid>
        </XGrid>
    }
}
