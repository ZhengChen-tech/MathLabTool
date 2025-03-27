const { ipcMain } = require('electron');

page_handle = null;
mlt_addon = null;

mlt_page_console_log = function(...log_str) {
	// console.log(typeof log_str, log_str, JSON.stringify(log_str));
	var ret = "";
	for(var idx in log_str) {
		if(typeof log_str[idx] == 'object') {
			ret += JSON.stringify(log_str[idx]);
		} else {
			ret += log_str[idx];
		}
	}
	if(page_handle){
		page_handle.sender.send('pong', 'page_console_log|' + ret);
	}
};

mlt_mlp = function(layout, datas, label, learn_rate, limit, predict_data, activate_func, loss_func, update_w_func) {
	if(activate_func == undefined) {
		activate_func = [];
		activate_func[0] = 0;
		for(var i = 1; i < layout.length; i++) {
			activate_func[i] = 1;
		}
	}
	if(loss_func == undefined) {
		loss_func = 1;
	}
	if(update_w_func == undefined) {
		update_w_func = 1;
	}
	return mlt_addon.mlt_mlp(layout, datas, label, learn_rate, limit, predict_data, 
						activate_func, loss_func, update_w_func);
};

ipcMain.on("ping", function (event, arg) {
	var msg_array = arg.split('|');
	if(msg_array[0] == 'page_handle') {
		page_handle = event;
		try {
			var addon_math = '../addon/mathlabtool';
			// var addon_math = 'D:/mlt_addon/addon/build/Release/mathlabtool';
			mlt_addon = require(addon_math);
		} catch (e) {
			page_handle.sender.send('pong', 'page_console_log|' + e.toString() + '\n');
		}
	} else if(msg_array[0] == 'get_dir') {
		if(msg_array[1] == 'MyComputer') {
			get_dir_root(event, msg_array[1]);
		} else {
			get_dir(event, msg_array[1]);
		}
	} else if(msg_array[0] == 'chat_send') {
		is_chat = 1;
		mlt_auto_code(msg_array[1]);
	} else if(msg_array[0] == 'chat_close') {
		is_chat = 0;
		is_custom_chat = 0;
		
		var params = {
			func: 'clean_auto_code'
		};
		forked.send(JSON.stringify(params));
	} else if(msg_array[0] == 'set_file') {
		set_file_write(event, msg_array[1], msg_array[2], 'set_file');
	} else if(msg_array[0] == 'run_file') {
		set_file_write(event, msg_array[1], msg_array[2], 'run_file');
	} else if(msg_array[0] == 'run_str') {
		page_handle = event;
		try {
			eval(msg_array[1]);
		} catch (e) {
			page_handle.sender.send('pong', 'page_console_log|' + e.toString() + '\n');
		}
	} else if(msg_array[0] == 'set_exist_file') {
		set_file_write(event, msg_array[1], msg_array[2], 'set_exist_file');
	} else if(msg_array[0] == 'draw_dim3') {
		// console.log("draw_dim3", msg_array);
		if(msg_array[1] == 'rotate') {
			draw_transform_graph_dim3(msg_array[2], msg_array[3], msg_array[4]);
		} else if(msg_array[1] == 'zoom') {
			draw_zoom_graph_dim3(msg_array[2], msg_array[3]);
		}
	} else if(msg_array[0] == 'handle_video_fps') {
		handle_video_fps(msg_array[1], msg_array[2]);
	} else if(msg_array[0] == 'a_play') {
		a_play(msg_array[1], msg_array[2]);
	}
});
