class CreateConnections < ActiveRecord::Migration
  def change
    create_table :connections do |t|
      t.belongs_to :user, index: true
      t.belongs_to :contact, index: true
      t.belongs_to :first_name, index: true
      t.belongs_to :last_name, index: true
      t.char :category
      t.timestamps
    end
  end
end
