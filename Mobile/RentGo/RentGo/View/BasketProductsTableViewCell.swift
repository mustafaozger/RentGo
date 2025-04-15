//
//  BasketProductsTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 15.04.2025.
//

import UIKit

class BasketProductsTableViewCell: UITableViewCell {
    
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    @IBOutlet weak var productDeliveryLabel: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    @IBOutlet weak var productCountLabel: UILabel!
    

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    @IBAction func decreaseCountTapped(_ sender: Any) {
    }
    
    @IBAction func increaseCountTapped(_ sender: Any) {
    }
    
    @IBAction func weeklyTapped(_ sender: Any) {
    }
    
    @IBAction func monthlyTapped(_ sender: Any) {
    }
    
}
