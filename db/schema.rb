# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140430194050) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "connections", force: true do |t|
    t.integer  "user_id"
    t.integer  "category"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "picture"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "custom_first_name"
    t.string   "custom_last_name"
    t.string   "linkedin_pic"
    t.string   "facebook_pic"
    t.string   "custom_pic"
    t.string   "linkedin_id"
    t.string   "facebook_id"
  end

  add_index "connections", ["user_id"], name: "index_connections_on_user_id", using: :btree

  create_table "logs", force: true do |t|
    t.integer  "connection_id"
    t.date     "timestamp"
    t.string   "source"
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "logs", ["connection_id"], name: "index_logs_on_connection_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "access_token"
    t.integer  "expires_at"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "linkedin_id"
    t.string   "facebook_id"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
