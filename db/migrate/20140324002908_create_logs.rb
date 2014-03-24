class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.belongs_to :connection, index: true
      t.date :timestamp
      t.string :source

      t.timestamps
    end
  end
end
