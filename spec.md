约定与规范
==========

## 后端规范
1. 增删改一律采用POST, 并只返回JSON, 结构为 {"error": 0, "message": "success", "result": {"id":234}}  
2. 增删改权限判断以URI路径为判断条件,尽量往这个方向努力,减少例外
3. 查询采用GET, 类Restful风格
4. URL使用无后缀风格,如增加.json后缀,则返回对应的json数据

## 字段结构
1. 模板  id,name,author,html    (id为0表示空白模板)
2. 站点  id,name,
	* 



## 核心功能
1. 站点发布
	/site/add   { name:name,html:html }     ### name 英文,用于拼path
2. 站点修改
	/site/edit  { id:id,html:html }         ### 
3. 站点发布
	/site/publish {id:id}
4. 站点查看
	/site/list


## 几个问题
1. 缩略图如何而来?
2. html保存在何处?    先用mongodb保存在json中
3. 








---------------------------
下面的先忽略


## 其它接口
1. 系统管理, 管理员权限
	* /user/add    GET为页面, POST为提交增加
	* /user/edit              POST为提交更新
	* /user/delete            POST为提交删除
	* /user/list   后面用户管理页面

2. 模板管理
	









