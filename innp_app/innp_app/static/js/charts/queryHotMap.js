//关注度接口
var zcgzdUrl = yuming + '/policy/getVisitCountForAllArea';      //政策关注度
var schydUrl = yuming + '/activity/getPublishCountForAllArea';    //双创活跃度
var zcfbslUrl = yuming + '/policy/getPublishCountForAllArea';   //政策分布
var CHART_CHINA_URL = 'js/charts/china.json';
$(function () {
	//政策温度计页面初始化: 默认显示政策关注度
    var text = ['关注度高', '关注度低'],
    Section = {
        "min": 0,
        "max": 2500
    };
    //加载地图数据
    loadMap(text, Section, zcgzdUrl);
});
console.log(zcgzdUrl);
//=====================================================
$(function () {
    //政策温度计页面政策切换
    $("#policyTab").find("li").each(function (index) {
        $(this).on("click", function () {
            $(this).addClass("current").siblings().removeClass("current");
            if (index == 0) {//双创关注度
                $("#queryGraph").html(" ");
                var text = ['关注度高', '关注度低'],
                    Section = {
                        "min": 0,
                        "max": 2500
                    };
                //加载地图数据
                loadMap(text, Section, zcgzdUrl);
                //加载TOP5数据
                //loadFivePolicyForClick('北京');
                
            } else if (index == 1) {//政策活跃度                                
                $("#queryGraph").html(" ");
                var text = ['活跃度高', '活跃度低'],
                	Section = {
                        "min": 0,
                        "max": 2500
                    };
                //加载地图数据
                loadMap(text, Section, schydUrl);
                //loadFiveActivityForClick('北京');
                
            } else if (index == 2) {//政策数量分布
                $("#queryGraph").html(" ");
                var text = ['分布数量大', '分布数量小'],
                    Section = {
                        "min": 0,
                        "max": 2500
                    };
                loadMap(text, Section, zcfbslUrl);
                //加载TOP5数据
                //loadFivePolicyForClick('北京');
            }
        });
    });

 
});




function loadMap(text, Section, dataUrl){
	var promptMsg = "访问量";
	if( dataUrl == yuming + 'policyController/getViewForPublish.do' ){
		promptMsg = "分布数量";
	}
    $.get(CHART_CHINA_URL, function (chinaJson) {
        echarts.registerMap('china', chinaJson);
        var mapMain = echarts.init(document.getElementById('queryGraph'));
        var maxCount = 0;
        var jsonArray = [];
        $.ajax({
        	type: "post", 					
        	url:dataUrl, 					
        	async:false, 		
        	dataType:"json",			
        	success:function(dataJson){
        		datas = dataJson.data; 
        		//遍历 datas，把省份名称和该省对应的政策数量封装成json数组
    			for ( var k in datas) {
    				var jsonObject = {};
    				var name = k;//获取省份名称
    				var tempCount = parseInt(datas[k]) + 20000;//获取该省份的政策数量
    				maxCount = Math.max(maxCount,tempCount);
    				jsonObject.name = name;
    				jsonObject.value = tempCount;
    				jsonArray.push(jsonObject);
    			}
        	} 				
        }); 	
        var geoCoordMap = {
        		"北京市": [116.46, 39.92],
                "天津市": [117.2, 39.13],
                "河北省": [114.48, 38.03],
                "山西省": [112.53, 37.87],
                "内蒙古自治区": [118.87, 42.28],
                "辽宁省": [123.38, 41.8],
                "吉林省": [125.35, 43.88],
                "黑龙江省": [126.63, 45.75],
                "上海市": [121.48, 31.22],
                "江苏省": [118.78333, 32.05000],
                "浙江省": [120.19, 30.26],
                "安徽省": [117.27, 31.86],
                "福建省": [118.1, 24.46],
                "江西省": [115.89, 28.68],
                "山东省": [117, 36.65],
                "广东省": [113.23, 23.16],
                "广西": [110.28, 25.29],
                "海南省": [110.35, 20.02],
                "河南省": [113.65, 34.76],
                "湖北省": [114.31, 30.52],
                "湖南省": [113, 28.21],
                "重庆市": [106.54, 29.59],
                "四川省": [104.06, 30.67],
                "贵州省": [106.71, 26.57],
                "云南省": [102.73, 25.04],
                "西藏自治区":[91.11,29.97],
                "陕西省": [109.47, 36.6],
                "甘肃省": [103.73, 36.03],
                "青海省": [101.74, 36.56],
                "宁夏回族自治区": [106.27, 38.47],
                "新疆维吾尔自治区": [87.68, 43.77],
                "香港特别行政区":[114.186124, 22.293586],
                "澳门特别行政区":[	113.557519,	22.204118],
                "台湾省":[121.973871, 24.086957]
        	};

        	var convertData = function (data) {
        	    var res = [];
        	    for (var i = 0; i < data.length; i++) {
        	        var geoCoord = geoCoordMap[data[i].name];
        	        if (geoCoord) {
        	            res.push(geoCoord.concat(data[i].value));
        	        }
        	    }
        	    return res;
        	};

        	option = {
        	    backgroundColor: '#eeeeee',
        	    visualMap: {
        	    	show:false,
        	        min: 0,
        	        max: maxCount,
        	        calculable:true,
//        	        splitNumber: 5,
        	        inRange: {
        	            color: ['red','yellow','green','blue'].reverse()
        	        },
        	        textStyle: {
        	            color: 'black'
        	        }
        	    },
        	    geo: {
        	        map: 'china',
        	        label: {
        	            emphasis: {
        	                show: true
        	            }
        	        },
        	        roam: false,
        	        itemStyle: {
        	            normal: {
        	                areaColor: '#fff',
        	                borderColor: '#111'
        	            },
        	            emphasis: {
        	                areaColor: '#f4e925'
        	            }
        	        }
        	    },
        	    series: [{
        	        name: '访问量',
        	        type: 'heatmap',
        	        coordinateSystem: 'geo',
        	        data:convertData(jsonArray)
        	    }]
        	};

        mapMain.on('click', function (params) {
        	if( dataUrl == yuming + 'activityController/getViewForPublish.do' ){
        		loadFiveActivityForClick(params.name);
        	}else{
        		loadFivePolicyForClick(params.name);
        	}
        });
        mapMain.setOption(option);
    });
}

/**
 * 获取地区访问量Top5政策
 * @param area
 */
function loadFivePolicyForClick(area){
	
}
/**
 * 获取地区访问量Top5活动
 * @param area
 */
function loadFiveActivityForClick(area){
	
}

function loadpolicydetail(id){
	$.ajax({
		url : yuming + 'policyController/getFirstView.do',
		type: "post",
		data:{"id":id},
		async : false,
		dataType:"json",
		success : function(data) {
			var html = "";
			html += "<li>【颁布单位】"+data.unit+"</li><li>【文    号】"+data.issuedNo+"</li>";
			var arr = data.issuedTime.split("-");
			var str = arr[0]+"年"+arr[1]+"月"+arr[2]+"日";
			$(".ConditCon").html(html);
			$(".timeDay").html(str);
			$(".conBtn").attr("onclick","javascript:searchtoText('"+id+"','政策温度计',' ',' ')");
		}
	});
}

