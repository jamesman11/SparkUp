class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :password
      t.integer :profile_id
      t.integer :team_id
      t.timestamps null: false
    end
  end
end
