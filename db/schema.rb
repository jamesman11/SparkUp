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

ActiveRecord::Schema.define(version: 20150626193049) do

  create_table "profiles", force: :cascade do |t|
    t.string   "name",         limit: 255
    t.string   "title",        limit: 255
    t.text     "description",  limit: 65535
    t.text     "interest",     limit: 65535
    t.string   "avatar",       limit: 255
    t.string   "location",     limit: 255
    t.text     "meet_history", limit: 65535
    t.integer  "team_id",      limit: 4
    t.integer  "user_id",      limit: 4
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "requests", force: :cascade do |t|
    t.string   "when",           limit: 255
    t.string   "where",          limit: 255
    t.string   "what",           limit: 255
    t.integer  "size",           limit: 4
    t.string   "who",            limit: 255
    t.text     "message",        limit: 65535
    t.string   "status",         limit: 255
    t.integer  "owner_id",       limit: 4
    t.text     "repliers",       limit: 65535
    t.integer  "acceptee_id",    limit: 4
    t.integer  "recipient_id",   limit: 4
    t.integer  "recipient_type", limit: 4
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  create_table "teams", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.text     "description",   limit: 65535
    t.integer  "members_count", limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username",   limit: 255
    t.string   "password",   limit: 255
    t.integer  "profile_id", limit: 4
    t.integer  "team_id",    limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end