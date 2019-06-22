let todoList=[];
let uid=30;
var storage = window.localStorage;
if(storage.getItem('todoList')!=null){
    alert('localStorage检测到本地有todoList');
    todoList=JSON.parse(storage.getItem('todoList'));
    uid=storage.getItem('uid');
    //alert(uid);
}else{
    alert('localStorage未检测到todoList');
    todoList=[
        {
            id:0,
            msg:'CV大项目',
            isFinished:true,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:1,
            msg:'语义SLAM答辩',
            isFinished:true,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:2,
            msg:'虚拟现实大项目',
            isFinished:false,
            isImportant:true,
            detail:'',
            ddl:''
        },
        {
            id:3,
            msg:'金爷爷答辩',
            isFinished:false,
            isImportant:true,
            detail:'',
            ddl:''
        },
        {
            id:4,
            msg:'炼丹',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:5,
            msg:'烧显卡',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:6,
            msg:'吹水',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:7,
            msg:'写文档',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },
        {
            id:8,
            msg:'复制代码',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },{
            id:9,
            msg:'欺骗老师',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        },{
            id:10,
            msg:'良心一点都不痛',
            isFinished:false,
            isImportant:false,
            detail:'',
            ddl:''
        }
    ];
    storage.setItem('todoList', JSON.stringify(todoList));
    storage.setItem('uid',30);
}


var oldTouch;
let showedList=[];
let filterList=[];
let asideNavState={
    isFold:false,
    tag:'all',
    searchInput:'',
    completeState:true
};
let rightNavState={
    curItem:null,
    isFold:false,
    editDetailFold:false,
    dateEditFold:false
};
let paginationState={
    curPage:1,
    pageSize:8,
};

function updateStorage() {
    storage.setItem('todoList', JSON.stringify(todoList));
    storage.setItem('uid',uid);
}

function genFilterList() {
    if(asideNavState.tag=='all'){
        filterList=todoList;
    }
    else if(asideNavState.tag=='important'){
        filterList=todoList.filter(function (item,index,arry) {
            return item.isImportant==true;
        })
    }
    else if(asideNavState.tag=='unFinished'){
        filterList=todoList.filter(function (item,index,arry) {
            return item.isFinished==false;
        })
    }
    else if(asideNavState.tag=='finished'){
        filterList=todoList.filter(function (item,index,arry) {
            return item.isFinished==true;
        })
    }else if(asideNavState.tag='overdue'){
        filterList=todoList.filter(function (item,index,arry) {
            let ddl=item.ddl;
            if(ddl.length>0) {
                let nowTime = new Date().Format("yyyy-MM-dd HH:mm");
                return ddl < nowTime;
            }
            return false;
        })
    }
    if(asideNavState.searchInput.length>0){
        filterList=filterList.filter(function (item,index,array) {
            if(item.msg.indexOf(asideNavState.searchInput)!=-1){
                return true
            }
            else{
                return false;
            }
        });
        asideNavState.searchInput='';
    }
}

function renderAsideNav(){
    if(asideNavState.isFold===false){
        $('#asideNav-fold').css("width",'0px');
    }else{
        $('#asideNav-fold').css("width",'180px');
    }
    let tagBtns=$('.tagBtn');
    for(let i=0; i<tagBtns.length; ++i){
        if(tagBtns.eq(i).attr('id')==asideNavState.tag){
            tagBtns.eq(i).addClass('activeTag');
        }
        else{
            tagBtns.eq(i).removeClass('activeTag');
        }
    }
    $('#importantCnt').text(todoList.filter(function (item,index,array) {
        return item.isImportant==true;
    }).length);
    $('#overdueCnt').text(todoList.filter(function (item,index,array) {
        if(item.ddl.length>0) {
            return item.ddl < new Date().Format("yyyy-MM-dd HH:mm");
        }
        return false;
    }).length);
    $('#unFinishedCnt').text(todoList.filter(function (item,index,array) {
        return item.isFinished==false;
    }).length);
    $('#finishedCnt').text(todoList.filter(function (item,index,array) {
        return item.isFinished==true;
    }).length);
    $('#allCnt').text(todoList.length);
    $('#routerName').text(asideNavState.tag+' '+'Items');
}

function renderRightNav() {
    if(rightNavState.curItem!=null) {
        if (rightNavState.isFold === false) {
            $('#rightNav-fold').css("width", '0px');
            $('#rightNav-fold').css("padding", '0');
            setTimeout(function () {
                $('#rightNav-fold').css('display', 'none');
            }, 300);
            //alert('OK');
        } else {
            $('#rightNav-fold').css('display', 'inline');
            setTimeout(function () {
                $('#rightNav-fold').css("width", '225px');
                $('#rightNav-fold').css("padding", '10px 10px');
            }, 300);
        }
        $('#titleInput').val(rightNavState.curItem.msg);
        $('#detailContainer').html((marked(rightNavState.curItem.detail)));
        if(rightNavState.editDetailFold==false){
            $('#detailEditor').css('height','0px');
        }
        else {
            $('#detailEditor').css('height','195px');
            $('#detailInput').val(rightNavState.curItem.detail)
        }

        if(rightNavState.dateEditFold==false){
            $('#dateInputContainer').css('height','0px');
        }else{
            $('#dateInputContainer').css('height','30px');
        }

        if(rightNavState.curItem.ddl.length>0){
            $('#ddl').text(rightNavState.curItem.ddl);
        }else{
            $('#ddl').text('未设置截止日期');
        }
    }
}

function renderShowedList(){
    let fst=(paginationState.curPage-1)*paginationState.pageSize;
    let lst=(paginationState.curPage)*paginationState.pageSize;
    genFilterList();

    showedList=filterList.slice(fst,lst);
    let todoLines=$('.todoLine');
    for(let i=0; i<todoLines.length; ++i){
        todoLines.eq(i).empty();
    }
    for(let i=0; i<todoLines.length&&i<showedList.length; ++i){
        let todoItem=$("<div style='position: relative; transition: 3s;'></div>");
        todoItem.attr("id",showedList[i].id);
        todoItem.attr("left-offset",0);
        todoItem.attr("oldPosX",0);
        todoItem.attr("newPosX",0);
        todoItem.attr("isMove",0);
        todoItem.on("touchstart", function (ev) {
            console.log(ev.type, ev);
            oldTouch = ev.touches[0];
        });
        todoItem.on("touchmove", function (ev) {
            var newTouch = ev.touches[0];
            var left =
                parseFloat(todoItem.attr('left-offset') || 0) +
                (newTouch.clientX - oldTouch.clientX);
            oldTouch = ev.touches[0];
            console.log(ev.type, left, top);
            todoItem.attr('left-offset',left);
            if(todoItem.attr('left-offset')>100){
                todoItem.css('left','500px');
                for(let j=0; j<todoList.length; ++j){
                    if(todoList[j].id==todoItem.attr('id')){
                        todoList.splice(j,1);
                        renderShowedList();
                        return
                    }
                }
            }
        });
        todoItem.on("touchend", function (ev) {
            todoItem.attr('left-offset',0)
        });

        let todoCheck=$('<div style="float: left; width: 10%; padding: 0 10px"><input type="checkbox" class="tui-checkbox"></div>');
        todoCheck.children('input:checkbox').attr('checked',showedList[i].isFinished);
        todoCheck.on('click',function () {
            showedList[i].isFinished=!showedList[i].isFinished;
            renderShowedList();
        });

        let todoMsg=$('<div class="todo-msg">hello</div>');
        todoMsg.text(showedList[i].msg);
        if(showedList[i].isFinished){
            todoMsg.addClass("completed");
        }
        todoMsg.on('click',function () {
            rightNavState.isFold=!rightNavState.isFold;
            rightNavState.curItem=showedList[i];
            renderRightNav();
        });
        if(showedList[i].ddl.length>0&&showedList[i].ddl<new Date().Format("yyyy-MM-dd HH:mm")){
            todoMsg.css('color','#ff483f');
        }

        let todoImportant=$('<div style="float: left; width: 5%; padding: 0 10px; position: relative; top: 10px"><span class="iconfont" style="font-size: 20pt">&#xe7df;</span></div>');
        if(showedList[i].isImportant==true) {
            todoImportant.children('span').html('&#xe86a;');
        } else {
            todoImportant.children('span').html('&#xe7df;');
        }
        todoImportant.on('click',function () {
            showedList[i].isImportant=!showedList[i].isImportant;
            renderShowedList();
        });

        todoItem.append(todoCheck);
        todoItem.append(todoMsg);
        todoItem.append(todoImportant);
        todoItem.appendTo(todoLines[i]);
    }
    updateStorage();
}

function renderPagination() {
    $('#gotoPageInput').val(paginationState.curPage);
}

function addTodo(){
    //alert('add');
    let msg=$('#addInput').val();
    if(msg.length==0){
        alert('输入不能为空');
        return;
    }
    $('#addInput').val('');
    let item={
        id:uid++,
        msg:msg,
        isFinished:false,
        isImportant:false,
        detail:'',
        ddl:''
    };
    todoList.push(item);
    renderShowedList();
}

$(function () {
    // var time1 = new Date().Format("yyyy-MM-dd HH:mm");
    // $('#ddl').text(time1);


    renderAsideNav();
    renderRightNav(); //$('#rightNav-fold').css('display','none');
    renderShowedList();
    renderPagination();

    $('#asideNavToggle').on('click',function () {
        asideNavState.isFold=asideNavState.isFold !== true;
        renderAsideNav();
    });
    $('.tagBtn').on('click', function (e) {
        asideNavState.tag=$(e.target).attr('id');
        renderShowedList();
        renderAsideNav();
    });
    $('#searchBtn').on('click',function () {
        asideNavState.searchInput=$('#searchInput').val();
        $('#searchInput').val('');
        renderShowedList();
    });

    //right nav
    $('#rightNavToggle').on('click',function () {
        rightNavState.isFold=false;
        renderRightNav();
    });
    $('#titleEditBtn').on('click',function () {
        rightNavState.curItem.msg=$('#titleInput').val();
        renderShowedList();
    });
    $('#editDetailToggle').on('click',function () {
        rightNavState.editDetailFold=!rightNavState.editDetailFold;
        renderRightNav();
    });
    $('#saveDetailBtn').on('click',function () {
        //$('#detailContainer').html( '<h1>hello</h1>');
        rightNavState.curItem.detail=$('#detailInput').val();
        renderRightNav();
        // $('#detailContainer').html((marked(rightNavState.curItem.detail)));
    });
    $('#dateEditToggle').on('click',function () {
        rightNavState.dateEditFold=!rightNavState.dateEditFold;
        $('#dateInput').focus();
        renderRightNav();
    });
    $('#saveDateBtn').on('click',function () {
        rightNavState.curItem.ddl=$('#dateInput').val().replace('T',' ');
        //alert(rightNavState.curItem.ddl);
        renderRightNav();
        renderShowedList();
    });

    //main
    let addBtn=$('#addBtn');
    let addInput=$('#addInput');
    addBtn.on('click',addTodo);
    $('#completeAllToggle').on('click',function () {
        for(let i=0; i<todoList.length; ++i){
            todoList[i].isFinished=asideNavState.completeState;
        }
        renderShowedList();
        asideNavState.completeState=!asideNavState.completeState;
    });

    $('#deleteAllCompleted').on('click',function () {
        let newTodoList=[];
        for(let i=0; i<todoList.length; ++i){
            if(todoList[i].isFinished==false){
                newTodoList.push(todoList[i]);
            }
        }
        todoList=[];
        todoList=newTodoList;
        renderShowedList();
    });

    $('#dateBtn1').on('click',function () {
        //alert($('#datePicker1').val().replace('T',' '))
    });
    $('#prevPageBtn').on('click',function () {
        if(paginationState.curPage>1){
            paginationState.curPage--;
            renderShowedList();
        }
        renderPagination()
    });
    $('#nextPageBtn').on('click',function () {
        genFilterList();
        if(paginationState.curPage*paginationState.pageSize<filterList.length){
            paginationState.curPage++;
            renderShowedList();
        }
        renderPagination();
    });
    $('#gotoPageBtn').on('click',function () {
        let lo=1;
        genFilterList();
        let hi=parseInt(filterList.length/paginationState.pageSize)
        if(hi*paginationState.pageSize<filterList.length){
            hi++;
        }
        if($('#gotoPageInput').val()<lo){
            $('#gotoPageInput').val(1)
            paginationState.curPage=1;
        }
        else if($('#gotoPageInput').val()>hi){
            $('#gotoPageInput').val(hi);
            paginationState.curPage=hi;
        }
        else{
            paginationState.curPage=$('#gotoPageInput').val();
        }
        renderShowedList();
    })
});