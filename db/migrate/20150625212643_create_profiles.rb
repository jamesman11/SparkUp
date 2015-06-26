class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.string :name
      t.string :title
      t.text :description
      t.text :interest
      t.string :avatar
      t.string :location
      t.text :meet_history
      t.integer :team_id
      t.integer :user_id
      t.timestamps null: false
    end
  end
end
