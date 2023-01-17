    class ImageMark {
        constructor(){
            // 申明各种变量
            this.lineList=[];//线的集合
            this.arcList=[];//圆的集合
            this.temporaryLine=[];//线临时存放
            this.temporaryArc=[];//圆临时存放
            this.timer;//定时器
            this.canvs_id='';//包裹canvas容器的id
            this.markimg_url='';//图片的url
            this.canvas='';//canvas容器
            this.ctx='';//canvas对象
            this.isline=false;//代表划线
            this.isarc=false;//代表画图
            this.image;//image对象
            this.image_url_list=[];//输出的图片数组
        }
        init(option){
            let _this=this;
            if(option.url){
                _this.markimg_url=option.url
            }else{
                throw 'url undefined'
            }
            if(option.el){
                _this.canvs_id=option.el
            }else{
                throw 'el undefined'
            };
            _this.image = new Image;
            let imagew,imageh,
            // 获取宽度
                elw = document.getElementById(_this.canvs_id).offsetWidth;
            // 创建一个canvas
            _this.canvas=document.createElement('canvas');
            _this.ctx=_this.canvas.getContext("2d");
            _this.canvas.width=elw;
            _this.image.src = _this.markimg_url;
            _this.image.setAttribute('crossOrigin', 'anonymous');
            _this.image.onload = ()=>{
                imagew = _this.image.width;
                imageh = _this.image.height;
                _this.canvas.height = imageh/(imagew/elw);
                _this.ctx.drawImage(_this.image,0,0,elw,_this.canvas.height);
 	            document.getElementById(_this.canvs_id).appendChild(_this.canvas);
                // 监听canvsa上面的活动
                _this.start();
                _this.end();
            }
           
        }
        start(){
            let _this = this;
            _this.canvas.addEventListener('touchstart',(e)=>{
                // 计算手指的位置
                let touches = e.touches[0];
                if(_this.isline){
                    _this.temporaryLine=[];
                    _this.temporaryLine.push(
                        {
                            x:touches.pageX-_this.canvas.getBoundingClientRect().left,
                            y:touches.pageY-_this.canvas.getBoundingClientRect().top,
                        }
                    );
                }
                if(_this.isarc){
                    _this.temporaryArc=[];
                    _this.temporaryArc.push(
                        {
                            x:touches.pageX-_this.canvas.getBoundingClientRect().left,
                            y:touches.pageY-_this.canvas.getBoundingClientRect().top,
                        }
                    );
                }  
            })
            _this.move();
            document.addEventListener("touchmove",_this.defaultEvent,false);
            
        }
        end(){
            let _this=this;
            _this.canvas.addEventListener('touchend',()=>{
                if(_this.isline){
                    // 处理长时间停留时的误差
                    for(var i=_this.temporaryLine.length-1;i>=1;i--){
                        if(Math.abs(_this.temporaryLine[i].x-_this.temporaryLine[i-1].x)<=5 && Math.abs(_this.temporaryLine[i].y-_this.temporaryLine[i-1].y)<=5){
                            _this.temporaryLine.splice(i,1)
                        }else{
                            break;
                        }
                    }
                    _this.lineList.push(_this.temporaryLine);
                    _this.drawLine(_this.temporaryLine,true);
                }
                if(_this.isarc && _this.temporaryArc.length===2){
                    _this.arcList.push(_this.temporaryArc);
                }
            })
            document.removeEventListener("touchmove",this.defaultEvent,false);
        }
        // 移动
        move(){
            let _this=this,
                delay=50;
            _this.canvas.addEventListener('touchmove',(e)=>{
                e.preventDefault();
                if(_this.isline){
                    delay=100;
                }else{
                    delay=10;
                }
                let touches = e.touches[0];
                if(_this.timer){
                    clearTimeout(_this.timer)
                }
                _this.timer =setTimeout(()=>{
                    if(_this.isline){
                        _this.temporaryLine.push(
                            {
                                x:touches.pageX-_this.canvas.getBoundingClientRect().left,
                                y:touches.pageY-_this.canvas.getBoundingClientRect().top,
                            }
                        )
                        // 绘图
                        _this.drawLine(_this.temporaryLine,false);
                    }
                    if(_this.isarc){
                        // 画圆
                        _this.temporaryArc.length=1;
                        _this.temporaryArc.push({
                            x:touches.pageX-_this.canvas.getBoundingClientRect().left,
                            y:touches.pageY-_this.canvas.getBoundingClientRect().top,
                        })
                        _this.beforeDrawArc(_this.temporaryArc);
                    }
                }, delay)
            })
        }
        // 阻止默认事件
        defaultEvent(e){
            e.preventDefault();
        }
        //画线
        drawLine(data,isTria){
            this.ctx.beginPath();
            this.ctx.lineWidth=5;
            this.canvas.fillStyle="#1dd1a1";
            // for循环绘制中间点
            for(let i=0;i<data.length;i++){
                let [ux,uy]= [data[i].x,data[i].y];
                if(i===0){
                    this.ctx.moveTo(ux, uy);
                }else{
                    this.ctx.lineTo(ux,uy);
                }
            }
            this.ctx.strokeStyle="#1dd1a1";
            this.ctx.stroke();
            if(isTria && data.length>=2){
                this.drawArrow(data[data.length-2].x,data[data.length-2].y,data[data.length-1].x,data[data.length-1].y,30,20,5,'#1dd1a1')
            }
        }
        // 画圆的前置操作
        beforeDrawArc(data){
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);//清除全部重绘
            this.ctx.drawImage(this.image,0,0,this.canvas.width,this.canvas.height);//重绘图片
            // 重绘所有的线
            for(let j=0;j<this.lineList.length;j++){
                this.drawLine(this.lineList[j],true)
            }
            //重绘所有的圆
            for(let i=0;i<this.arcList.length;i++){
                this.drawArc(this.arcList[i])
            }
            if(data && data.length===2){
                this.drawArc(data)
            }
        }
        // 画圆的方法
        drawArc(data){
            let [ox,oy,nx,ny]=[data[0].x,data[0].y,data[1].x,data[1].y]
            let r = Math.sqrt(Math.pow(nx-ox, 2)+Math.pow(ny-oy, 2));
            this.ctx.beginPath();
            this.ctx.lineWidth=5;
            this.ctx.strokeStyle="#FF0000";
            this.ctx.arc(ox,oy,r,0,Math.PI*2,true);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        //清除全部元素的操作
        clearAll(){
            this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);//清除全部重绘
            this.ctx.drawImage(this.image,0,0,this.canvas.width,this.canvas.height);
            this.lineList=[];
            this.arcList=[]
        }
        //撤销上一个
        clearLast(){
            // 删除最后一个 然后绘制
            if((this.isline && this.lineList.length>0 )|| this.arcList.length==0){
                this.lineList.splice(this.lineList.length-1,1);  
            }else{
                this.arcList.splice(this.arcList.length-1,1);
            }
            this.beforeDrawArc();
        }
        line(){
            this.isline=true;
            this.isarc=false;
        }
        arc(){
            this.isline=false;
            this.isarc=true;
        }
        // 绘制箭头
        drawArrow(fromX, fromY, toX, toY,theta, headlen, width, color) {
            theta = typeof(theta) != 'undefined' ? theta : 30;
            headlen = typeof(theta) != 'undefined' ? headlen : 10;
            width = typeof(width) != 'undefined' ? width : 1;
            color = typeof(color) != 'color' ? color : '#000';
            // 计算各角度和对应的P2,P3坐标
            let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
                angle1 = (angle + theta) * Math.PI / 180,
                angle2 = (angle - theta) * Math.PI / 180,
                topX = headlen * Math.cos(angle1),
                topY = headlen * Math.sin(angle1),
                botX = headlen * Math.cos(angle2),
                botY = headlen * Math.sin(angle2);
            this.ctx.save();
            this.ctx.beginPath();
            let arrowX = fromX - topX,
                arrowY = fromY - topY;
            this.ctx.moveTo(arrowX, arrowY);
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            arrowX = toX + topX;
            arrowY = toY + topY;
            this.ctx.moveTo(arrowX, arrowY);
            this.ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            this.ctx.lineTo(arrowX, arrowY);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.stroke();
            this.ctx.restore();
        }
        //输出图片 quality质量默认1  type图片的格式默认image/png   rules规则返回的'all'  'arc'  'line'   methods输出图片方式 methods 单张输出||全部输出   
        getImageList(option, callback){
            let type = option.type || 'image/png'
            let rules = option.rules || 'all';//默认输出全部
            let quality = option.quality || 1;//输出图片的质量   0-0.92  默认1高质量输出
            let methods = option.methods || 10;//是否输出全部 10输出全部相关的  否则按张输出
            let original = option.original || false;//是否可以输出没有标记过的图片；默认不可以
            this.image_url_list=[];
            if(rules==='all'){
                if(this.lineList.length>0 || this.arcList.length>0){
                    this.image_url_list.push(this.canvas.toDataURL(type,quality)) 
                }else if(original){
                    this.image_url_list.push(this.canvas.toDataURL(type,quality)) 
                }
            }else{
                //线判断是否要整张输出
                let nowList;
                if(rules==='line'){
                    nowList=this.lineList;
                }else{
                    nowList=this.arcList
                }
                if(methods===10){
                    this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);//清除全部重绘
                    this.ctx.drawImage(this.image,0,0,this.canvas.width,this.canvas.height);//将图重新画在画布上面
                    for(let i=0;i<nowList.length;i++){
                        if(rules==='line'){
                            this.drawLine(nowList[i],true)
                        }else{
                            this.drawArc(nowList[i])
                        }  
                    }
                    if(nowList.length>0){
                        this.image_url_list.push(this.canvas.toDataURL(type,quality)) 
                    }
                }else{
                    for(let i=0;i<nowList.length;i++){
                        this.ctx.clearRect(0, 0, this.canvas.width,this.canvas.height);//清除全部重绘
                        this.ctx.drawImage(this.image,0,0,this.canvas.width,this.canvas.height);//将图重新画在画布上面
                        if(rules==='line'){
                            this.drawLine(nowList[i],true)
                        }else{
                            this.drawArc(nowList[i])
                        }
                        this.image_url_list.push(this.canvas.toDataURL(type,quality))
                    }
                }
                //将图像还原
                this.beforeDrawArc()
            }
            callback(this.image_url_list)
        }
    }
    export default ImageMark;