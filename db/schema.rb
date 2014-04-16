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

ActiveRecord::Schema.define(version: 20140326183516) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "connections", force: true do |t|
    t.integer  "user_id"
    t.integer  "contact_id"
    t.integer  "first_name_id"
    t.integer  "last_name_id"
    t.integer  "category"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "connections", ["contact_id"], name: "index_connections_on_contact_id", using: :btree
  add_index "connections", ["first_name_id"], name: "index_connections_on_first_name_id", using: :btree
  add_index "connections", ["last_name_id"], name: "index_connections_on_last_name_id", using: :btree
  add_index "connections", ["user_id"], name: "index_connections_on_user_id", using: :btree

  create_table "contacts", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "first_names", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "last_names", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "linkedins", force: true do |t|
    t.integer  "user_id"
    t.integer  "contact_id"
    t.string   "linkedin_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "linkedins", ["contact_id"], name: "index_linkedins_on_contact_id", using: :btree
  add_index "linkedins", ["user_id"], name: "index_linkedins_on_user_id", using: :btree

  create_table "logs", force: true do |t|
    t.integer  "connection_id"
    t.date     "timestamp"
    t.string   "source"
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "logs", ["connection_id"], name: "index_logs_on_connection_id", using: :btree

  create_table "pictures", force: true do |t|
    t.string   "linkedin_pic"
    t.integer  "user_id"
    t.integer  "contact_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pictures", ["contact_id"], name: "index_pictures_on_contact_id", using: :btree
  add_index "pictures", ["user_id"], name: "index_pictures_on_user_id", using: :btree

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
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
