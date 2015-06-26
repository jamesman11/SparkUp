class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.string :when
      t.string :where
      t.string :what
      t.integer :size
      t.string :who
      t.text :message
      t.string :status
      t.integer :owner_id
      t.text :repliers
      t.integer :acceptee_id

      t.timestamps null: false
    end
  end
end
