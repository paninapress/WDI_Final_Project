class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.belongs_to :first_name, index: true
      t.belongs_to :last_name, index: true

      t.timestamps
    end
  end
end
