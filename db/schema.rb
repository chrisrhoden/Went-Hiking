# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110331052347) do

  create_table "assets", :force => true do |t|
    t.string   "data_file_name"
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "attachings_count",  :default => 0
    t.datetime "created_at"
    t.datetime "data_updated_at"
  end

  create_table "attachings", :force => true do |t|
    t.integer  "attachable_id"
    t.integer  "asset_id"
    t.string   "attachable_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "attachings", ["asset_id"], :name => "index_attachings_on_asset_id"
  add_index "attachings", ["attachable_id"], :name => "index_attachings_on_attachable_id"

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "hike_id"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "forecasts", :force => true do |t|
    t.float    "lat"
    t.float    "lng"
    t.text     "details"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "hearts", :force => true do |t|
    t.integer  "user_id"
    t.integer  "hike_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "hikes", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.integer  "nights"
    t.float    "mileage"
    t.integer  "elevation"
    t.datetime "hiked_at"
    t.float    "lat"
    t.float    "lng"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "report"
  end

  add_index "hikes", ["id"], :name => "index_hikes_on_id"
  add_index "hikes", ["user_id"], :name => "index_hikes_on_user_id"

  create_table "map_layers", :force => true do |t|
    t.string   "title"
    t.string   "shp_file_name"
    t.string   "shp_content_type"
    t.integer  "shp_file_size"
    t.string   "shx_file_name"
    t.string   "shx_content_type"
    t.integer  "shx_file_size"
    t.string   "dbf_file_name"
    t.string   "dbf_content_type"
    t.integer  "dbf_file_size"
    t.datetime "shp_updated_at"
    t.datetime "shx_updated_at"
    t.datetime "dbf_updated_at"
    t.integer  "layer_group_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", :force => true do |t|
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.integer  "width"
    t.integer  "height"
    t.datetime "taken_at"
    t.float    "lat"
    t.float    "lng"
    t.string   "caption"
    t.integer  "hike_id"
    t.integer  "user_id"
    t.string   "camera_model"
    t.string   "camera_exposure"
    t.float    "camera_f_stop"
    t.integer  "camera_iso"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "photos", ["hike_id"], :name => "index_photos_on_hike_id"
  add_index "photos", ["user_id"], :name => "index_photos_on_user_id"

  create_table "routes", :force => true do |t|
    t.string   "title"
    t.float    "lat"
    t.float    "lng"
    t.integer  "zoom"
    t.string   "map_type"
    t.text     "path"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.geometry "the_geom",         :limit => nil
    t.string   "gpx_file_name"
    t.string   "gpx_content_type"
    t.integer  "gpx_file_size"
  end

  create_table "shapes", :force => true do |t|
    t.integer  "layer_id"
    t.geometry "the_geom",   :limit => nil
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "routes_id"
  end

  create_table "tracks", :force => true do |t|
    t.string   "uri"
    t.float    "lat"
    t.float    "lng"
    t.integer  "zoom"
    t.string   "map_type"
    t.text     "path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
    t.datetime "last_login_at"
    t.boolean  "admin"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "ytd_mileage"
    t.integer  "ytd_elevation"
    t.integer  "ytd_nights"
    t.string   "location"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.string   "locale"
    t.boolean  "notify_on_comment",   :default => true
  end

  add_index "users", ["id"], :name => "index_users_on_id"

end
