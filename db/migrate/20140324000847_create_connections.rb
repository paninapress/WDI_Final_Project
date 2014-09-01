class CreateConnections < ActiveRecord::Migration
  def change
    create_table :connections do |t|
      t.belongs_to :user, index: true
      t.integer :category, default: 180
      t.timestamps
    end
  end
end
