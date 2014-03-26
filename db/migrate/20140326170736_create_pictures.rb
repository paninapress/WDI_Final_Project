class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.string :linkedin_pic
      t.belongs_to :user, index: true
      t.belongs_to :contact, index: true

      t.timestamps
    end
  end
end
