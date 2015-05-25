package com.ilaw66.ui;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.ForegroundColorSpan;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.ilaw66.R;
import com.ilaw66.app.AppConfig;
import com.ilaw66.app.BaseActivity;
import com.ilaw66.app.DataHolder;
import com.ilaw66.entity.Address;
import com.ilaw66.entity.City;
import com.ilaw66.entity.LawFile;
import com.ilaw66.entity.LawFileUpload;
import com.ilaw66.util.ConvertUtils;
import com.ilaw66.util.DeviceUtils;
import com.ilaw66.util.FileUtils;
import com.ilaw66.util.HttpUtils;
import com.ilaw66.util.JsonUtils;
import com.ilaw66.widget.BaseDialog;
import com.ilaw66.widget.LoadingDialog;
import com.ilaw66.widget.PagerSlidingTab;
import com.lidroid.xutils.BitmapUtils;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.view.annotation.ViewInject;
import com.lidroid.xutils.view.annotation.event.OnClick;

public class LawyerLetterSendEditAcvitity extends BaseActivity {
	@ViewInject(R.id.top_iv)
	View top_iv;
	@ViewInject(R.id.tab_v)
	PagerSlidingTab tab_v;
	@ViewInject(R.id.info_vp)
	ViewPager info_vp;
	
	LoadingDialog loadingDialog;
	BaseDialog buyDialog;
	
	String letterId;
	String letterStatus;
	String letterType;
	
	JSONObject letter;
	
	JSONArray evidences;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_lawer_letter_send_edit);
		letterType = getIntent().getStringExtra("letterType");
		letterStatus = getIntent().getStringExtra("letterStatus");
		letterId = getIntent().getStringExtra("letterId");
		initViews();
		
		initData();
	}
	
	private void initData(){
		HttpUtils.put(AppConfig.URL_ROOT_HTTPS +"/letter/getDetail?id="+letterId, null, new HttpUtils.RequestCallback(){
			@SuppressLint("NewApi")
			@Override
			public void onSuccess(ResponseInfo<String> response) {
				// TODO Auto-generated method stub
				super.onSuccess(response);
				try {
					letter = new JSONObject(response.result);
					
					if("CT0001".equals(letter.getString("type"))){
						mCompanyViews.company_et.setText(letter.getString("corporate"));
						mCompanyViews.company_et.setSelection(mCompanyViews.company_et.length());
						mCompanyViews.phone_et.setText(letter.getString("phone"));
						mCompanyViews.name_et.setText(letter.getString("represents"));
						mCompanyViews.need_et.setText(letter.getString("expectation"));
						mCompanyViews.postcode_et.setText(letter.getJSONObject("address").getString("postcode"));
						mCompanyViews.more_et.setText(letter.getString("problem"));
						mCompanyViews.address_et.setText(letter.getJSONObject("address").getString("streets"));
						mCompanyViews.area2_tv.setText(letter.getJSONObject("address").getJSONObject("province").getString("name")
								+letter.getJSONObject("address").getJSONObject("city").getString("name")
								+letter.getJSONObject("address").getJSONObject("town").getString("name"));
						
						mCompanyViews.address = new Address();
						mCompanyViews.address.streets = letter.getJSONObject("address").getString("streets");
						mCompanyViews.address.postcode = letter.getJSONObject("address").getString("postcode");
						mCompanyViews.address.city = new City();
						mCompanyViews.address.city.id = letter.getJSONObject("address").getJSONObject("city").getString("id");
						mCompanyViews.address.city.cityID = letter.getJSONObject("address").getJSONObject("city").getString("id");
						mCompanyViews.address.city.name = letter.getJSONObject("address").getJSONObject("city").getString("name");

						mCompanyViews.address.province = new City();
						mCompanyViews.address.province.id = letter.getJSONObject("address").getJSONObject("province").getString("id");
						mCompanyViews.address.province.cityID = letter.getJSONObject("address").getJSONObject("province").getString("id");
						mCompanyViews.address.province.name = letter.getJSONObject("address").getJSONObject("province").getString("name");

						mCompanyViews.address.town = new City();
						mCompanyViews.address.town.id = letter.getJSONObject("address").getJSONObject("town").getString("id");
						mCompanyViews.address.town.cityID = letter.getJSONObject("address").getJSONObject("town").getString("id");
						mCompanyViews.address.town.name = letter.getJSONObject("address").getJSONObject("town").getString("name");

						evidences = letter.getJSONArray("evidences");
						for(int i =0;i<evidences.length();i++){
							JSONObject item = evidences.getJSONObject(i);
							View v = getLayoutInflater().inflate(R.layout.upload_view, mCompanyViews.file_ll, false);
							v.setTop(ConvertUtils.dip2px(LawyerLetterSendEditAcvitity.this, 15));
							TextView file_tv = (TextView) v.findViewById(R.id.file_tv);
							file_tv.setText(item.getString("fileName"));
//							View preview_ib = v.findViewById(R.id.preview_ib);
//							View del_ib = v.findViewById(R.id.del_ib);
//							preview_ib.setOnClickListener(new PreviewClickListener(index));
//							del_ib.setOnClickListener(new DelOnClickListener(index));
//							preview_ib.setSelected(!TextUtils.isEmpty(path));
//							del_ib.setSelected(!TextUtils.isEmpty(path));
							mCompanyViews.file_ll.addView(v, i);
						}
					}else{
//						mPersionalViews.company_et.setText(letter.getString("corporate"));
						mPersionalViews.phone_et.setText(letter.getString("phone"));
						mPersionalViews.phone_et.setSelection(mPersionalViews.phone_et.length());
						mPersionalViews.name_et.setText(letter.getString("name"));
						mPersionalViews.need_et.setText(letter.getString("expectation"));
						mPersionalViews.postcode_et.setText(letter.getJSONObject("address").getString("postcode"));
						mPersionalViews.more_et.setText(letter.getString("problem"));
						mPersionalViews.address_et.setText(letter.getJSONObject("address").getString("streets"));
						mPersionalViews.area2_tv.setText(letter.getJSONObject("address").getJSONObject("province").getString("name")
								+letter.getJSONObject("address").getJSONObject("city").getString("name")
								+letter.getJSONObject("address").getJSONObject("town").getString("name"));
						
						mPersionalViews.address = new Address();
						mPersionalViews.address.streets = letter.getJSONObject("address").getString("streets");
						mPersionalViews.address.postcode = letter.getJSONObject("address").getString("postcode");
						mPersionalViews.address.city = new City();
						mPersionalViews.address.city.id = letter.getJSONObject("address").getJSONObject("city").getString("id");
						mPersionalViews.address.city.cityID = letter.getJSONObject("address").getJSONObject("city").getString("id");
						mPersionalViews.address.city.name = letter.getJSONObject("address").getJSONObject("city").getString("name");

						mPersionalViews.address.province = new City();
						mPersionalViews.address.province.id = letter.getJSONObject("address").getJSONObject("province").getString("id");
						mPersionalViews.address.province.cityID = letter.getJSONObject("address").getJSONObject("province").getString("id");
						mPersionalViews.address.province.name = letter.getJSONObject("address").getJSONObject("province").getString("name");

						mPersionalViews.address.town = new City();
						mPersionalViews.address.town.id = letter.getJSONObject("address").getJSONObject("town").getString("id");
						mPersionalViews.address.town.cityID = letter.getJSONObject("address").getJSONObject("town").getString("id");
						mPersionalViews.address.town.name = letter.getJSONObject("address").getJSONObject("town").getString("name");

						evidences = letter.getJSONArray("evidences");
						for(int i =0;i<evidences.length();i++){
							JSONObject item = evidences.getJSONObject(i);
							View v = getLayoutInflater().inflate(R.layout.upload_view, mPersionalViews.file_ll, false);
							v.setTop(ConvertUtils.dip2px(LawyerLetterSendEditAcvitity.this, 15));
							TextView file_tv = (TextView) v.findViewById(R.id.file_tv);
							file_tv.setText(item.getString("fileName"));
//							View preview_ib = v.findViewById(R.id.preview_ib);
//							View del_ib = v.findViewById(R.id.del_ib);
//							preview_ib.setOnClickListener(new PreviewClickListener(index));
//							del_ib.setOnClickListener(new DelOnClickListener(index));
//							preview_ib.setSelected(!TextUtils.isEmpty(path));
//							del_ib.setSelected(!TextUtils.isEmpty(path));
							mPersionalViews.file_ll.addView(v, i);
						}
					}
					
					
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
			}
		});
	}
	
	private void initViews() {
		setLayoutHeight(top_iv, (int) (0.138 * DeviceUtils.getScreenHeight(this))); // 960*235(960*1704)
		info_vp.setAdapter(new VPAdapter());
		tab_v.setViewPager(info_vp);
	}
	
	@OnClick(R.id.back_iv)
	public void back(View v) {
		onBackPressed();
	}
	
	class VPAdapter extends PagerAdapter {
		
		@Override
		public CharSequence getPageTitle(int position) {
			return position == 0 ? "发给企业" : "发给个人";
		}

		@Override
		public int getCount() {
			return 2;
		}

		@Override
		public boolean isViewFromObject(View v, Object o) {
			return v == o;
		}
		
		@Override
		public Object instantiateItem(ViewGroup container, int position) {
			View v = null;
			switch (position) {
			case 0:
				v = getView0();
				break;
			case 1:
				v = getView1();
				break;
			}
			container.addView(v);
			return v;
		}
		
		@Override
		public void destroyItem(ViewGroup container, int position, Object object) {
			container.removeView((View) object);
		}
	}
	
	CompanyViews mCompanyViews;
	private View getView0() {
		View v = getLayoutInflater().inflate(R.layout.send_letter_info_1, null);
		setImportantText((TextView) v.findViewById(R.id.company_tv));
		setImportantText((TextView) v.findViewById(R.id.name_tv));
		setImportantText((TextView) v.findViewById(R.id.area_tv));
		setImportantText((TextView) v.findViewById(R.id.address_tv));
		setImportantText((TextView) v.findViewById(R.id.postcode_tv));
		setImportantText((TextView) v.findViewById(R.id.more_tv));
		setImportantText((TextView) v.findViewById(R.id.file_tv));
		setImportantText((TextView) v.findViewById(R.id.need_tv));
		setImportantText((TextView) v.findViewById(R.id.phone_tv));
		
		mCompanyViews = new CompanyViews(v);
		return v;
	}
	
	PersionalViews mPersionalViews;
	private View getView1() {
		View v = getLayoutInflater().inflate(R.layout.send_letter_info_2, null);
		setImportantText((TextView) v.findViewById(R.id.name_tv));
		setImportantText((TextView) v.findViewById(R.id.phone_tv));
		setImportantText((TextView) v.findViewById(R.id.area_tv));
		setImportantText((TextView) v.findViewById(R.id.address_tv));
		setImportantText((TextView) v.findViewById(R.id.postcode_tv));
		setImportantText((TextView) v.findViewById(R.id.more_tv));
		setImportantText((TextView) v.findViewById(R.id.file_tv));
		setImportantText((TextView) v.findViewById(R.id.need_tv));
		
		mPersionalViews = new PersionalViews(v);
		return v;
	}
	
	private ItemView getCurrentItemView() {
		return info_vp.getCurrentItem() == 0 ? mCompanyViews : mPersionalViews;
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		if (resultCode == RESULT_OK) {
			if (requestCode == 1) {
				Address addr = (Address) data.getSerializableExtra("address_selected");
				getCurrentItemView().setAddress(addr);
			} else if (requestCode == 2) {
				Cursor cursor = getContentResolver().query(data.getData(), null, null, null, null);
				String path = null;
				if (cursor.moveToFirst()) {
					path = cursor.getString(cursor.getColumnIndex("_data"));
				}
				getCurrentItemView().addFile(path);
			}
		}
	}
	
	private void setImportantText(TextView tv) {
		SpannableString sp = new SpannableString(tv.getText());
		sp.setSpan(new ForegroundColorSpan(Color.RED), 0, 1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
		tv.setText(sp);
	}
	
	class CompanyViews extends ItemView {
		EditText company_et;
		EditText phone_et;
		
		public CompanyViews(View v) {
			super(v);
			company_et = (EditText) v.findViewById(R.id.company_et);
			phone_et = (EditText) v.findViewById(R.id.phone_et);
		}
		
		@Override
		boolean check() {
			if (company_et.length() == 0) {
				showToast("请输入企业名称");
				company_et.requestFocus();
				return false;
			}
			return super.check();
		}
		
		@Override
		Map<String, Object> getParams() {
			Map<String, Object> p = super.getParams();
			p.put("type", "CT0001");
			p.put("corporate", company_et.getText().toString());
			p.put("phone", phone_et.getText().toString());
			p.put("represents", name_et.getText().toString());
			return p;
		}
	}
	
	class PersionalViews extends ItemView {
		EditText phone_et;
		
		public PersionalViews(View v) {
			super(v);
			phone_et = (EditText) v.findViewById(R.id.phone_et);
		}
		
		@Override
		boolean check() {
			if (name_et.length() == 0) {
				showToast("请输入收函人姓名");
				name_et.requestFocus();
				return false;
			}
			if (phone_et.length() == 0) {
				showToast("请输入收函人电话");
				phone_et.requestFocus();
				return false;
			}
			return super.check();
		}
		
		@Override
		Map<String, Object> getParams() {
			Map<String, Object> p = super.getParams();
			p.put("type", "CT0002");
			p.put("phone", phone_et.getText().toString());
			p.put("name", name_et.getText().toString());
			return p;
		}
	}
	
	abstract class ItemView {
		EditText name_et;
		TextView area2_tv;
		EditText address_et;
		EditText postcode_et;
		EditText more_et;
		ViewGroup file_ll;
		TextView file_num_tv;
		View upload_v;
		EditText need_et;
		View submit_bt;
		
		List<String> paths = new ArrayList<String>();
		List<LawFile> files = new ArrayList<LawFile>();
		Address address;
		
		Map<String, Object> params;
		
		public ItemView(View v) {
			name_et = (EditText) v.findViewById(R.id.name_et);
			area2_tv = (TextView) v.findViewById(R.id.area2_tv);
			address_et = (EditText) v.findViewById(R.id.address_et);
			postcode_et = (EditText) v.findViewById(R.id.postcode_et);
			more_et = (EditText) v.findViewById(R.id.more_et);
			file_ll = (ViewGroup) v.findViewById(R.id.file_ll);
			file_num_tv = (TextView) v.findViewById(R.id.file_num_tv);
			upload_v = v.findViewById(R.id.upload_v);
			need_et = (EditText) v.findViewById(R.id.need_et);
			submit_bt = v.findViewById(R.id.submit_bt);
			
			area2_tv.setOnClickListener(new View.OnClickListener() {
				
				@Override
				public void onClick(View v) {
					startActivityForResult(new Intent(LawyerLetterSendEditAcvitity.this, AreaSelectActivity.class), 1);
				}
			});
			upload_v.setOnClickListener(new View.OnClickListener() {
				
				@Override
				public void onClick(View v) {
					Intent it = new Intent(Intent.ACTION_PICK);
					it.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
					startActivityForResult(it, 2);
				}
			});
			submit_bt.setOnClickListener(new View.OnClickListener() {
				
				@Override
				public void onClick(View v) {
					if (!check()) {
						return;
					}
					if (buyDialog == null) {
						buyDialog = new BaseDialog(LawyerLetterSendEditAcvitity.this);
						buyDialog.setMessageText("您确定要更新发律师函的信息？");
						buyDialog.setOnClickListener(new BaseDialog.OnClickListener() {
							
							@Override
							public void onRightClick(BaseDialog dialog) {
								dialog.dismiss();
								upload();
							}
							
							@Override
							public void onLeftClick(BaseDialog dialog) {
								dialog.dismiss();
							}
						});
					}
					buyDialog.show();
				}
			});
		}
		
		boolean check() {
			if (name_et.length() == 0) {
				showToast("请输入收函人姓名");
				name_et.requestFocus();
				return false;
			}
			if (address == null) {
				showToast("请选择地区");
				return false;
			}
			if (address_et.length() < 5) {
				showToast("请输入正确的详细地址。长度5-120个字符。");
				address_et.requestFocus();
				return false;
			}
			if (postcode_et.length() == 0) {
				showToast("请输入邮政编码");
				postcode_et.requestFocus();
				return false;
			}
			if (more_et.length() < 5) {
				showToast("请输入情况说明。长度5-500个字符。");
				more_et.requestFocus();
				return false;
			}
//			if (paths.isEmpty()) {
//				showToast("至少上传一份证明材料");
//				return false;
//			}
			if (need_et.length() < 5) {
				showToast("请输入情况说明。长度5-500个字符。");
				need_et.requestFocus();
				return false;
			}
			return true;
		}
		
		void setAddress(Address address) {
			this.address = address;
			if (address != null) {
				String area = (address.province == null ? "" : address.province.name) + "" + (address.city == null ? "" : address.city.name)+ "" + (address.town == null ? "" : address.town.name);
				area2_tv.setText(area);
			}
		};
		
		void addFile(final String path) {
			if (!TextUtils.isEmpty(path)) {
				paths.add(path);
				file_num_tv.setText("共" + paths.size() + "个");
				View fileView = getLayoutInflater().inflate(R.layout.send_letter_info_file, file_ll, false);
				ImageView iv = (ImageView) fileView.findViewById(R.id.pic_iv);
				TextView tv = (TextView) fileView.findViewById(R.id.name_tv);
				new BitmapUtils(LawyerLetterSendEditAcvitity.this).display(iv, path);
				tv.setText(FileUtils.getFileNmae(path));
				file_ll.addView(fileView);
				fileView.setOnClickListener(new View.OnClickListener() {
					
					@Override
					public void onClick(View v) {
						startActivity(PictureActivity.class, "picture_uri", path);
					}
				});
			}
		}
		
		int uploadIndex = 0;
		void upload() {
			uploadIndex = 0;
			doUpload();
		}
		
		private void doUpload() {
			if(paths.size() == 0){
				if (loadingDialog == null) {
					loadingDialog = new LoadingDialog(LawyerLetterSendEditAcvitity.this);
				}
				doSubmit();
				return;
			}
			RequestParams params = new RequestParams();
			params.addBodyParameter("file", new File(paths.get(uploadIndex)));
			HttpUtils.post(AppConfig.URL_ROOT_HTTPS + "/file/upload.json", params, new HttpUtils.RequestCallback() {
				
				@Override
				public void onStart() {
					if (loadingDialog == null) {
						loadingDialog = new LoadingDialog(LawyerLetterSendEditAcvitity.this);
					}
					loadingDialog.setMessageText("正在上传...");
					loadingDialog.show();
				}
				
				@Override
				public void onSuccess(ResponseInfo<String> response) {
					List<LawFileUpload> list = JsonUtils.getGson().fromJson(response.result, new TypeToken<List<LawFileUpload>>() {}.getType());
					if (list != null && !list.isEmpty()) {
						files.addAll(LawFileUpload.toLawFiles(list));
						uploadIndex++;
						if (uploadIndex >= paths.size()) {
							doSubmit();
						} else {
							doUpload();
						}
					} else {
						onFailure(null, false);
					}
				}
				
				@Override
				public void onFailure(String error, boolean catched) {
					loadingDialog.dismiss();
					showToast("文件上传失败，请重试");
				}
			});
		}
		
		Map<String, Object> getParams()  {
			params = new HashMap<String, Object>();
			try {
				address.postcode = postcode_et.getText().toString();
				address.streets = address_et.getText().toString();
				address.city.id = address.city.cityID;
				address.town.id = address.town.cityID;
				address.province.id = address.province.cityID;
				params.put("address", address);
				params.put("problem", more_et.getText().toString());
				params.put("expectaion", need_et.getText().toString());
				for(int i =0;i<evidences.length();i++){
					LawFile file = new LawFile();
					try {
						file.fileId = evidences.getJSONObject(i).getString("fileId");
						file.fileName = evidences.getJSONObject(i).getString("fileName");
						files.add(file);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
				
				params.put("evidences", files);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return params;
		}
		
		void doSubmit() {
			GsonBuilder gson = new GsonBuilder();
	    	ExclusionStrategy es = new ExclusionStrategy() {
				
				@Override
				public boolean shouldSkipField(FieldAttributes arg0) {
					if ("parent".equals(arg0.getName()) || "first".equals(arg0.getName())) {  
						return true;  
					}
					return false;
				}
				
				@Override
				public boolean shouldSkipClass(Class<?> arg0) {
					return false;
				}
			};
	    	gson.setExclusionStrategies(es);
	    	JSONObject obj = new JSONObject();
	    	try {
				obj.put("id", letter.getString("_id"));
			} catch (JSONException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	    	StringBuilder sb = new StringBuilder();
			sb.append("{\"data\":").append(gson.create().toJson(getParams())).append(",\"uid\":\"")
			.append(DataHolder.getInstance().getUser()._id).append("\",\"").append("filter\":").append(obj.toString()).append("}");
			RequestParams params = new RequestParams();
			try {
				params.setBodyEntity(new StringEntity(sb.toString(), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			
			params.addHeader("Content-Type","application/json;charset=UTF-8");
			HttpUtils.put(AppConfig.URL_ROOT_HTTPS + "/letter/update", params, new HttpUtils.RequestCallback() {
				
				@Override
				public void onStart() {
					loadingDialog.setMessageText("正在提交...");
					loadingDialog.show();
				}
				
				@Override
				public void onSuccess(ResponseInfo<String> response) {
					showToast("您的问题已经提交，请等待我们的回复");
					DataHolder.getInstance().isLawyerLetterChanged = true;
					finish();
				}
				
				@Override
				public void onFailure(String error, boolean catched) {
					showToast("提交失败，请重试");
				}
				
				@Override
				public void onCallBack() {
					loadingDialog.dismiss();
				}
			});
		}
	}
}
