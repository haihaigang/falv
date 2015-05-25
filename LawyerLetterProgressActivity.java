package com.ilaw66.ui;

import org.json.JSONArray;
import org.json.JSONObject;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.ilaw66.R;
import com.ilaw66.app.AppConfig;
import com.ilaw66.app.BaseActivity;
import com.ilaw66.util.HttpUtils;
import com.ilaw66.util.TimeUtils;
import com.ilaw66.widget.BaseDialog;
import com.ilaw66.widget.LoadingDialog;
import com.ilaw66.widget.OneButtonDialog;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.view.annotation.ViewInject;
import com.lidroid.xutils.view.annotation.event.OnClick;

public class LawyerLetterProgressActivity extends BaseActivity {
	@ViewInject(R.id.name_tv)
	TextView name_tv;
	@ViewInject(R.id.submit_tv)
	TextView submit_tv;
	@ViewInject(R.id.make_tv)
	TextView make_tv;
	@ViewInject(R.id.sure_tv)
	TextView sure_tv;
	@ViewInject(R.id.send_tv)
	TextView send_tv;
	@ViewInject(R.id.save_tv)
	TextView save_tv;
	
	@ViewInject(R.id.make_iv)
	ImageView make_iv;
	@ViewInject(R.id.sure_iv)
	ImageView sure_iv;
	@ViewInject(R.id.send_iv)
	ImageView send_iv;
	@ViewInject(R.id.save_iv)
	ImageView save_iv;
	
	LoadingDialog loadingDialog;
	BaseDialog dialog;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_lawyer_letter_progress);
		loadData();
	}
	
	@OnClick(R.id.back_iv)
	public void back(View v) {
		onBackPressed();
	}
	
	private void loadData() {
		HttpUtils.put(AppConfig.URL_ROOT_HTTPS + "/letter/getDetail?id=" + getIntent().getStringExtra("letter_id"),null, new HttpUtils.RequestCallback() {
			
			@Override
			public void onStart() {
				loadingDialog = new LoadingDialog(LawyerLetterProgressActivity.this, "正在获取进度...");
				loadingDialog.show();
			}
			
			@Override
			public void onSuccess(ResponseInfo<String> response) {
				try {
					JSONObject jo = new JSONObject(response.result);
					name_tv.setText("发给" + jo.optString("CT0001".equals(jo.optString("type")) ? "corporate" : "name") + "的律师函");
					JSONArray ja = jo.optJSONArray("statusHistory");
					make_iv.setBackgroundResource(R.drawable.ic_letter_progress_5);
					sure_iv.setBackgroundResource(R.drawable.ic_letter_progress_5);
					send_iv.setBackgroundResource(R.drawable.ic_letter_progress_5);
					save_iv.setBackgroundResource(R.drawable.ic_letter_progress_6);
					if (ja == null) {
						submit_tv.append(TimeUtils.format(TimeUtils.formatServerTime(jo.optString("createAt")), "yyyy.MM.dd HH:mm"));
						submit_tv.setTextColor(Color.WHITE);
						submit_tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						if (make_tv.length() <= 5) {
							make_tv.append("两个工作日内");
						}
						if (sure_tv.length() <= 5) {
							sure_tv.append("");
						}
						if (send_tv.length() <= 5) {
							send_tv.append("");
						}
						if (save_tv.length() <= 5) {
							save_tv.append("");
						}
						return;
					}
					for (int i = 0; i < ja.length(); i++) {
						JSONObject joo = ja.optJSONObject(i);
						if (joo == null) {
							continue;
						}
						String time = TimeUtils.format(TimeUtils.formatServerTime(joo.optString("statusUpdateAt")), "yyyy.MM.dd HH:mm");
						TextView tv = null;
						String status = joo.optString("status");
						if ("LS0001".equals(status)) {
							tv = submit_tv;
							make_tv.setText("预计完成：");
							make_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							make_tv.setTextColor(Color.WHITE);
							make_tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						} else if ("LS0002".equals(status)) {
							tv = make_tv;
							make_tv.setText("完成时间：");
							make_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							sure_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							sure_tv.setTextColor(Color.WHITE);
							sure_tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						} else if ("LS0003".equals(status)) {
							tv = sure_tv;
							make_tv.setText("完成时间：");
							send_tv.append("两个工作日内");
							make_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							sure_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							send_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							send_tv.setTextColor(Color.WHITE);
							send_tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						} else if ("LS0004".equals(status)) {
							tv = send_tv;
							make_tv.setText("完成时间：");
							make_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							sure_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							send_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							save_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							
							save_tv.setTextColor(Color.WHITE);
							save_tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						} else if ("LS0005".equals(status)) {
							tv = save_tv;
							make_tv.setText("完成时间：");
							make_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							sure_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							send_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
							save_iv.setBackgroundResource(R.drawable.ic_letter_progress_1);
						}
						if (tv != null) {
							tv.append(time);
							tv.setTextColor(Color.WHITE);
							tv.setBackgroundResource(R.drawable.ic_letter_progress_4);
						}
					}
					
					if (make_tv.length() <= 5) {
						make_tv.append("两个工作日内");
					}
					else if (sure_tv.length() <= 5) {
						sure_tv.append("");
					}
//					else if (send_tv.length() <= 5) {
//						send_tv.append("两个工作日内");
//					}
//					else if (save_tv.length() <= 5) {
//						save_tv.append("两个工作日内");
//					}
				} catch (Exception e) {
					e.printStackTrace();
					onFailure(null, false);
				}
			}
			
			@Override
			public void onFailure(String error, boolean catched) {
				dialog = new OneButtonDialog(LawyerLetterProgressActivity.this);
				dialog.setMessageText("无法获取进度，请重试");
				dialog.setOnClickListener(new BaseDialog.OnClickListener() {
					
					@Override
					public void onRightClick(BaseDialog dialog) {
						dialog.dismiss();
						finish();
					}
					
					@Override
					public void onLeftClick(BaseDialog dialog) {
						dialog.dismiss();
					}
				});
				dialog.show();
			}
			
			@Override
			public void onCallBack() {
				loadingDialog.dismiss();
			}
		});
	}
}
