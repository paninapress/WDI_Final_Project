class CreateConnections < ActiveRecord::Migration
  def change
    create_table :connections do |t|
      t.belongs_to :user, index: true
      t.integer :category
      t.timestamps
    end
  end
end
