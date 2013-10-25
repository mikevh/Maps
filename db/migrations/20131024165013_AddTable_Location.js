{
	"up":{
		"create_table":{
			"name":"Location",
			"columns":[{
			"name":"Category","type":"reference"},{
			"name":"Name","type":"string", "nullable":false},{
			"name":"Latitude","type":"float", "nullable":false},{
			"name":"Longitude","type":"float", "nullable":false}]
		}
	},
	"down":{
		"drop_table":"Location"}}