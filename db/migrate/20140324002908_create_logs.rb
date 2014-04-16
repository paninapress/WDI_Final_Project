class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.belongs_to :connection, index: true
      t.datetime :timestamp
      t.string :source
      t.text :comment

      t.timestamps
    end
  end
end
